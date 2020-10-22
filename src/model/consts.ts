export const BASE_URL = 'https://t.me/s/nexta_tv';
export const BASE_POST_URL = 'https://t.me/nexta_tv';
export const nexta_logo = 'https://cdn4.telesco.pe/file/Dy0U9oJN81WCMupXEOnyaMuOtvf30RnHpiJaLFM69l-yT1RlDMeYYiENaaYKhMYMQl5FfCzut1O3pPWNrEEpUmq6nGP0d3rrsgm04KMIRpfGZau1SZXGEduuHXj-Sk-Krh-EIGvxl7UZaJJPD7GqU1a9Jjg_2t2TY3RrlFzaAyqs8XRWEqW58KqblUiVeYntKo1Z8utDZdefJJK_JQ3gTcYM24THIsQjgKIsO9YT3U-uztI7tMScNr-1eLrlAcxA921AOV5qYWd5r2xJNGqCneb5ecjQ-0HdOMdNyzmFzY9b_zecR8E_EVjc6qO_uJ-JuE7IhxVAxnoJEIklMoLEiA.jpg';


export const Selectors = {
    tgme_widget_message_link_preview: '.tgme_widget_message_link_preview',
    tgme_widget_message_photo_wrap: '.tgme_widget_message_photo_wrap',
    tgme_widget_message_wrap: '.tgme_widget_message_wrap',
    tgme_widget_message: '.tgme_widget_message',
    tgme_widget_message_text: '.tgme_widget_message_text',
    tgme_widget_message_date: '.tgme_widget_message_date',
    video: {
        not_supported: '.tgme_widget_message_video_player.not_supported',
        supported: '.tgme_widget_message_video_player:not(.not_supported)',
        thumb: '.tgme_widget_message_video_thumb',
    }
}

export const RegExps = {
    no_whitespacesandnline: new RegExp('\\s+', 'g'),
    no_onlywitespaces: new RegExp(' +?', 'g'),
}