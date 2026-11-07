import { i18n } from '@kit.LocalizationKit';

/**
 * 汉字转拼音（无音标，空格分隔音节），用于读一读的同音字容错判定。
 * Any-Latn 先把汉字音译成带声调的拉丁文，再用 Latin-ASCII 去掉声调符号。
 */
export class NativePinyin {
  private static latn: i18n.Transliterator | null = null;
  private static ascii: i18n.Transliterator | null = null;

  private static ensure(): boolean {
    if (NativePinyin.latn !== null && NativePinyin.ascii !== null) {
      return true;
    }
    try {
      NativePinyin.latn = i18n.Transliterator.getInstance('Any-Latn');
      NativePinyin.ascii = i18n.Transliterator.getInstance('Latin-ASCII');
      return true;
    } catch (err) {
      return false;
    }
  }

  static toPinyin(text: string): string {
    if (text.length === 0) {
      return '';
    }
    if (!NativePinyin.ensure()) {
      return '';
    }
    const latn: i18n.Transliterator | null = NativePinyin.latn;
    const ascii: i18n.Transliterator | null = NativePinyin.ascii;
    if (latn === null || ascii === null) {
      return '';
    }
    try {
      const tone: string = latn.transform(text);
      const plain: string = ascii.transform(tone);
      return plain.toLowerCase().trim();
    } catch (err) {
      return '';
    }
  }
}
