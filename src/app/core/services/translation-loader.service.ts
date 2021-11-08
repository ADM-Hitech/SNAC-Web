import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export interface Locale {
    lang: string;
    // tslint:disable-next-line:ban-types
    data: Object;
}

@Injectable()
export class AppTranslationLoaderService {

    public Lang: BehaviorSubject<string> = new BehaviorSubject<string>('en');

    constructor(private translate: TranslateService) {}

    public loadTranslations(...args: Locale[]): void {
        const locales = [...args];

        locales.forEach((locale) => {
            this.translate.setTranslation(locale.lang, locale.data, true);
        });
    }
}
