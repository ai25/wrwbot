import * as jsdom from 'jsdom';
import { DEBUG } from './config';
import { RegExps, Selectors } from './model/consts';
import { Post, Preview, Video } from './model/data';

export function NotImplemented() {
    throw new Error("Not yet implement");  
}

export function parseToPosts(document: Document): Post[] {
    let posts: Post[] = [];

    let tgme_message_wraps = document.querySelectorAll(Selectors.tgme_widget_message_wrap)

    tgme_message_wraps.forEach((element: Element) => {
        posts.push(messageWrapToPost(element))
    })

    log(posts, true)

    return posts;
}

export function messageWrapToPost(element: Element): Post {
    let post = new Post(
        fetchIDFromPost(element),
        fetchContentFromPost(element),
        fetchPreviewFromPost(element),
        fetchMessagePhotosURLFromPost(element),
        fetchVideosFromPost(element),
    )

    return post;
}

/// content testing
export function testParseContent(document: Document): string[] {
    let contents: string[] = [];

    let tgme_message_wraps = document.querySelectorAll(Selectors.tgme_widget_message_wrap)

    tgme_message_wraps.forEach((element: Element) => {
        contents.push(_testFetchContent(element))
    })
    return contents;
}

function _testFetchContent(element: Element): string {
    element.querySelector(Selectors.tgme_widget_message_text)?.querySelectorAll('br').forEach((el) => {
        console.log(el.tagName);
        el.replaceWith('\n');
    })

    element.querySelector(Selectors.tgme_widget_message_text)?.querySelectorAll('*').forEach((el) => {
        if (el.textContent && el.textContent.trim().length != 0) {
            let content = `${el.textContent}`
            el.replaceWith(content)
        } else {
            el.remove();
        }
    })

    let html_content = element.querySelector(Selectors.tgme_widget_message_text)
        ?.textContent
        ?.trim() || "";

    console.log(html_content);

    return html_content;
}

///---

function _fetchContentPretty(element: Element): string {
    element.querySelector(Selectors.tgme_widget_message_text)?.querySelectorAll('br').forEach((el) => {
        el.replaceWith('\n');
    })

    element.querySelector(Selectors.tgme_widget_message_text)?.querySelectorAll('*').forEach((el) => {
        if (el.textContent && el.textContent.trim().length != 0) {
            el.replaceWith(el.textContent)
        } else {
            el.remove();
        }
    })

    let html_content = element.querySelector(Selectors.tgme_widget_message_text)
        ?.textContent
        ?.trim() || "";

    return html_content;
}

function _fetchContentAsInnerHTML(element: Element): string {
    let html_content = element.querySelector(Selectors.tgme_widget_message_text)?.innerHTML || "";

    return html_content;
}

function fetchIDFromPost(element: Element): Number {
    let data_post: Number = Number(
        element
            .querySelector(Selectors.tgme_widget_message_date)
            ?.getAttribute('href')
            ?.split('/')
            .pop());

    return data_post;
}

// function fetchIDFromPost(element: Element): Number {
//     let data_post: Number = Number(
//         element
//             .querySelector(Selectors.tgme_widget_message)
//             ?.getAttribute('data-post')
//             ?.split('/')
//             .pop());

//     return data_post;
// }



function fetchContentFromPost(element: Element): string {
    let html_content = _fetchContentPretty(element);

    return html_content;
}

function fetchMessagePhotosURLFromPost(element: Element): URL[] {
    const message_photos: URL[] = []

    const photos_wraps = element.querySelectorAll(Selectors.tgme_widget_message_photo_wrap)
    photos_wraps.forEach(photo_wrap => {
        const photo_url: URL | null = getBackgroundImageURL(photo_wrap)
        if (photo_url)
            message_photos.push(photo_url)
    })

    // let message_photo: URL | null = null
    // if (message_photo_el != null) {
    //     let url = new jsdom.JSDOM(message_photo_el.innerHTML).window.getComputedStyle(message_photo_el).getPropertyValue("background-image").slice(4, -1);
    //     message_photo = new URL(url)
    // }

    // let message_photo_el = element.querySelector(Selectors.tgme_widget_message_photo_wrap)
    // let message_photo: URL | null = getBackgroundImageURL(message_photo_el);

    return message_photos;
}

function fetchPreviewFromPost(element: Element): Preview | null {
    let preview_el = element.querySelector(Selectors.tgme_widget_message_link_preview)
    if (preview_el == null) return null;

    let preview_content = preview_el.textContent || ""
    let preview_url: URL = new URL(preview_el.getAttribute('href') || "")
    return new Preview(preview_content, preview_url)
}

function fetchVideosFromPost(element: Element): Video[] {
    let videos: Video[] = [];
    let supported_video_els = element.querySelectorAll(Selectors.video.supported);
    supported_video_els.forEach((el) => {
        let isSupported = true;
        createVideo(el, isSupported)
    });

    let unsupported_video_els = element.querySelectorAll(Selectors.video.not_supported);
    unsupported_video_els.forEach((el) => {
        let isSupported = false;
        createVideo(el, isSupported)
    })

    function createVideo(el: Element, isSupported: boolean) {
        let thumb_el = el.querySelector(Selectors.video.thumb);
        let thumb_url: URL | null = getBackgroundImageURL(thumb_el);

        let tglink: URL | null = (() => {
            let href = el.getAttribute("href");
            return href == null ? null : new URL(href);
        })();

        let video_url: URL | null = isSupported ? (() => {
            let attr = el.querySelector("video[src]")?.getAttribute("src");
            return attr == null ? null : new URL(attr);
        })() : null;

        let video = new Video(
            thumb_url,
            video_url,
            tglink,
            isSupported
        )

        videos.push(video);
    }

    return videos;
}

function getBackgroundImageURL(element: Element | null): URL | null {
    if (element != null) {
        let url = new jsdom.JSDOM(element.innerHTML).window.getComputedStyle(element).getPropertyValue("background-image").slice(4, -1);
        return new URL(url);
    }
    return null;
}

function log(s: any, stringify: boolean = false) {
    if (!DEBUG) return;
    if (stringify) {
        console.log(JSON.stringify(s, null, 2))
    } else {
        console.log(s)
    }
}