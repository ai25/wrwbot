import { JSDOM } from "jsdom";
import { BASE_URL } from "../model/consts";
import { testParseContent } from "../utils";
import * as fs from 'fs';
import * as jsdom from 'jsdom';

if (!globalThis.fetch) {
    globalThis.fetch = require('node-fetch');;
}

export async function readDOM(mocked: boolean | null): Promise<jsdom.JSDOM> {
    let body: string;
    const domOptions = {
        url: BASE_URL,
        contentType: "text/html",
        includeNodeLocations: true,
        storageQuota: 10000000
    }
    if (mocked) {
        body = getMockedHTMLs('./backup/mock1.html')
    } else {
        const response = await fetch(BASE_URL);
        body = await response.text();
    }
    return new JSDOM(body);
}

export async function readDOMByURL(url: string): Promise<jsdom.JSDOM> {
    let body: string;
    const domOptions = {
        url: url,
        contentType: "text/html",
        includeNodeLocations: true,
        storageQuota: 10000000
    }

    const response = await fetch(url);
    body = await response.text();
    return new JSDOM(body);
}

export function backup(obj: any, path: string) {
    fs.writeFileSync(path, JSON.stringify(obj, null, 2), 'utf-8');
    // fs.writeFileSync(path, util.inspect(obj, true), 'utf-8');
}

function getMockedHTMLs(mockpath: string): string {
    return fs.readFileSync(mockpath, 'utf-8');
}

export function testParse() {
    let body = getMockedHTMLs('./backup/mock3.html')
    let dom = new JSDOM(body)
    let contents = testParseContent(dom.window.document)

    backup(contents, "./backup/contents.json");
}