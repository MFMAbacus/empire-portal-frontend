import moment, {Moment} from 'moment';

export class DateTime {
  protected _date: Moment;

  protected constructor(date: Moment) {
    this._date = date;
  }

  public static parse(dateString: string): DateTime {
    const date = moment(dateString);
    const dateTime = new DateTime(date);
    return dateTime;
  }

  public static now(): DateTime {
    const date = moment();
    const dateTime = new DateTime(date);
    return dateTime;
  }

  public toString(): string {
    return this._date.format('YYYY-MM-DD hh:mm');
  }

  public toDateString(): string {
    return this._date.format('YYYY-MM-DD');
  }
}
