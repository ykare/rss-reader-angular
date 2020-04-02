export const Util = {
    safeHtml: (source: string): string => {
        // return this.domSanitizer.bypassSecurityTrustHtml(source);
        return source.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
    }
}