import uniqid from 'uniqid';
import { format } from 'util';
import { DOMParser } from '@xmldom/xmldom';
import { select } from 'xpath';
import { validationUrl, Validator } from './validator';
import { CasUser } from '../types';

class Saml11Validator implements Validator {
    path = 'samlValidate';
    service = 'TARGET';
    tolerance = parseInt((process.env.NEXT_CAS_CLIENT_SAML_TOLERANCE as string) ?? '1000');

    private samlRequestTemplate =
        '<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"><SOAP-ENV:Header/><SOAP-ENV:Body><samlp:Request xmlns:samlp="urn:oasis:names:tc:SAML:1.0:protocol" MajorVersion="1" MinorVersion="1" RequestID="%s" IssueInstant="%s"><samlp:AssertionArtifact>%s</samlp:AssertionArtifact></samlp:Request></SOAP-ENV:Body></SOAP-ENV:Envelope>';

    async validate(ticket: string): Promise<CasUser> {
        const currentDate = new Date().toISOString();
        const samlRequestBody = format(this.samlRequestTemplate, `${uniqid()}.${currentDate}`, currentDate, ticket);

        try {
            const response = await fetch(validationUrl(this), {
                method: 'POST',
                headers: { 'Content-Type': 'text/xml' },
                body: samlRequestBody
            });
            const xml = await response.text();

            if (this.parseStatusCode(xml).endsWith('RequestDenied')) {
                throw new Error('Ticket failed validation');
            }

            const [notBefore, notOnOrAfter] = this.parseDateTimeRange(xml);
            if (!this.isValidAssertion(notBefore, notOnOrAfter)) {
                throw new Error('Ticket failed validation');
            }

            return this.parseCasUser(xml);
        } catch {
            throw new Error('Ticket failed validation');
        }
    }

    private isValidAssertion(startDateTime: Date, endDateTime: Date): boolean {
        const currentDateTime = new Date();
        startDateTime.setMilliseconds(startDateTime.getMilliseconds() - this.tolerance);
        endDateTime.setMilliseconds(endDateTime.getMilliseconds() + this.tolerance);

        return currentDateTime > startDateTime && currentDateTime < endDateTime;
    }

    private parseCasUser(xml: string): CasUser {
        const doc = new DOMParser().parseFromString(xml, 'text/xml') as unknown as Node;

        const user = select(
            'string(//*[local-name() = "AttributeStatement"]/*[local-name() = "Subject"]/*[local-name() = "NameIdentifier"]/text())',
            doc
        ) as string;
        const attributes: Record<string, string | string[]> = {};

        (select('//*[local-name() = "Attribute"]', doc) as Node[]).forEach((statement) => {
            const attributeName = select('string(@AttributeName)', statement) as string;
            const attributeValues = select('*[local-name() = "AttributeValue"]/text()', statement) as Node[];

            attributes[attributeName] =
                attributeValues.length === 1
                    ? String(attributeValues[0])
                    : attributeValues.map((value) => String(value));
        });

        return {
            user,
            attributes
        };
    }

    private parseStatusCode(xml: string): string {
        const doc = new DOMParser().parseFromString(xml, 'text/xml') as unknown as Node;
        return select('string(//*[local-name() = "StatusCode"]/@Value)', doc) as string;
    }

    private parseDateTimeRange(xml: string): Date[] {
        const doc = new DOMParser().parseFromString(xml, 'text/xml') as unknown as Node;
        const notBefore = select('string(//*[local-name() = "Conditions"]/@NotBefore)', doc) as string;
        const notOnOrAfter = select('string(//*[local-name() = "Conditions"]/@NotOnOrAfter)', doc) as string;
        return [new Date(notBefore), new Date(notOnOrAfter)];
    }
}

export default Saml11Validator;
