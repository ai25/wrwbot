import { BASE_POST_URL, BASE_URL } from './consts';

export class Post {
    readonly _id: string;
    readonly post_id: Number;
    readonly tgme_link: URL;
    readonly formatted_content: String;
    readonly preview: Preview | null;
    // TODO message_photop: URL[] | null
    readonly message_photos: URL[];
    readonly message_videos: Video[];

    constructor(
        post_id: Number,
        content: String,
        preview: Preview | null,
        message_photos: URL[],
        message_videos: Video[],
    ) {
        this.post_id = post_id;
        this.tgme_link = new URL(`${BASE_POST_URL}/${post_id}`);
        this.formatted_content = content;
        
        this.preview = preview;
        this.message_photos = message_photos;
        this.message_videos = message_videos;
        this._id = this.genId();
    }

    private genId(): string {
        return this.post_id.toString();
    }
}

export class Preview {
    public readonly formatted_content: String;
    public readonly link: URL;

    constructor(formatted_content: String, urls: URL) {
        this.formatted_content = formatted_content;
        this.link = urls;
    }
}

export class Video {
    public readonly isSupported: boolean; // "tgme_widget_message_video_player not_supported"
    public readonly thumb: URL | null;
    public readonly video_url: URL | null;
    public readonly tgling_to_video: URL | null;

    constructor(thumb: URL | null, video_url: URL | null, tglink_to_video: URL | null, isSupported: boolean) {
        this.thumb = thumb;
        this.video_url = video_url;
        this.tgling_to_video = tglink_to_video;
        this.isSupported = isSupported;
    }
}