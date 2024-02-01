export class DateConverter{
    strJpFormatToYYYYMM(date:string){
        // yyyy年m月を yyyymm に置換する
        let splited = date.split(/[年]|[月]/ig);
        let ym = `${splited[0]}${this.zeroPad(splited[1])}`
        return ym

    }

     zeroPad(str: string) {
        if (str.length < 2) {
            return `0${str}`;

        }
        return str
    }
}