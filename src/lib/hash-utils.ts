/**
 * Compute hash of a text string.
 * Supports: MD5, SHA-1, SHA-256, SHA-512
 */
export async function computeHash(text: string, algorithm: string): Promise<string> {
    if (algorithm === 'MD5') {
        return md5(text);
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Compact MD5 implementation in pure TypeScript.
 * Based on common public domain implementations (e.g., matching RFC 1321).
 */
function md5(inputString: string): string {
    const hc = "0123456789abcdef";
    function rh(n: number) { var j, s = ""; for (j = 0; j <= 3; j++) s += hc.charAt((n >> (j * 8 + 4)) & 0x0F) + hc.charAt((n >> (j * 8)) & 0x0F); return s; }
    function ad(x: number, y: number) { var l = (x & 0xFFFF) + (y & 0xFFFF); var m = (x >> 16) + (y >> 16) + (l >> 16); return (m << 16) | (l & 0xFFFF); }
    function rl(n: number, c: number) { return (n << c) | (n >>> (32 - c)); }
    function cm(q: number, a: number, b: number, x: number, s: number, t: number) { return ad(rl(ad(ad(a, q), ad(x, t)), s), b); }
    function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm((b & c) | ((~b) & d), a, b, x, s, t); }
    function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm((b & d) | (c & (~d)), a, b, x, s, t); }
    function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm(b ^ c ^ d, a, b, x, s, t); }
    function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm(c ^ (b | (~d)), a, b, x, s, t); }

    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

    // UTF-8 encoding logic handles standard ASCII properly too
    var str = unescape(encodeURIComponent(inputString));

    for (var i = 0; i < str.length * 8; i += 8) {
        x[i >> 5] |= (str.charCodeAt(i / 8) & 0xFF) << (i % 32);
    }
    x[((str.length * 8) >> 5)] |= 0x80 << ((str.length * 8) % 32);
    x[(((str.length * 8 + 64) >>> 9) << 4) + 14] = str.length * 8;

    a = 1732584193; b = -271733879; c = -1732584194; d = 271733878;

    for (var i = 0; i < x.length; i += 16) {
        AA = a; BB = b; CC = c; DD = d;
        a = ff(a, b, c, d, x[i + 0], S11, -680876936);
        d = ff(d, a, b, c, x[i + 1], S12, -389564586);
        c = ff(c, d, a, b, x[i + 2], S13, 606105819);
        b = ff(b, c, d, a, x[i + 3], S14, -1044525330);
        a = ff(a, b, c, d, x[i + 4], S11, -176418897);
        d = ff(d, a, b, c, x[i + 5], S12, 1200080426);
        c = ff(c, d, a, b, x[i + 6], S13, -1473231341);
        b = ff(b, c, d, a, x[i + 7], S14, -45705983);
        a = ff(a, b, c, d, x[i + 8], S11, 1770035416);
        d = ff(d, a, b, c, x[i + 9], S12, -1958414417);
        c = ff(c, d, a, b, x[i + 10], S13, -42063);
        b = ff(b, c, d, a, x[i + 11], S14, -1990404162);
        a = ff(a, b, c, d, x[i + 12], S11, 1804603682);
        d = ff(d, a, b, c, x[i + 13], S12, -40341101);
        c = ff(c, d, a, b, x[i + 14], S13, -1502002290);
        b = ff(b, c, d, a, x[i + 15], S14, 1236535329);

        a = gg(a, b, c, d, x[i + 1], S21, -165796510);
        d = gg(d, a, b, c, x[i + 6], S22, -1069501632);
        c = gg(c, d, a, b, x[i + 11], S23, 643717713);
        b = gg(b, c, d, a, x[i + 0], S24, -373897302);
        a = gg(a, b, c, d, x[i + 5], S21, -701558691);
        d = gg(d, a, b, c, x[i + 10], S22, 38016083);
        c = gg(c, d, a, b, x[i + 15], S23, -660478335);
        b = gg(b, c, d, a, x[i + 4], S24, -405537848);
        a = gg(a, b, c, d, x[i + 9], S21, 568446438);
        d = gg(d, a, b, c, x[i + 14], S22, -1019803690);
        c = gg(c, d, a, b, x[i + 3], S23, -187363961);
        b = gg(b, c, d, a, x[i + 8], S24, 1163531501);
        a = gg(a, b, c, d, x[i + 13], S21, -1444681467);
        d = gg(d, a, b, c, x[i + 2], S22, -51403784);
        c = gg(c, d, a, b, x[i + 7], S23, 1735328473);
        b = gg(b, c, d, a, x[i + 12], S24, -1926607734);

        a = hh(a, b, c, d, x[i + 5], S31, -378558);
        d = hh(d, a, b, c, x[i + 8], S32, -2022574463);
        c = hh(c, d, a, b, x[i + 11], S33, 1839030562);
        b = hh(b, c, d, a, x[i + 14], S34, -35309556);
        a = hh(a, b, c, d, x[i + 1], S31, -1530992060);
        d = hh(d, a, b, c, x[i + 4], S32, 1272893353);
        c = hh(c, d, a, b, x[i + 7], S33, -155497632);
        b = hh(b, c, d, a, x[i + 10], S34, -1094730640);
        a = hh(a, b, c, d, x[i + 13], S31, 681279174);
        d = hh(d, a, b, c, x[i + 0], S32, -358537222);
        c = hh(c, d, a, b, x[i + 3], S33, -722521979);
        b = hh(b, c, d, a, x[i + 6], S34, 76029189);
        a = hh(a, b, c, d, x[i + 9], S31, -640364487);
        d = hh(d, a, b, c, x[i + 12], S32, -421815835);
        c = hh(c, d, a, b, x[i + 15], S33, 530742520);
        b = hh(b, c, d, a, x[i + 2], S34, -995338651);

        a = ii(a, b, c, d, x[i + 0], S41, -198630844);
        d = ii(d, a, b, c, x[i + 7], S42, 1126891415);
        c = ii(c, d, a, b, x[i + 14], S43, -1416354905);
        b = ii(b, c, d, a, x[i + 5], S44, -57434055);
        a = ii(a, b, c, d, x[i + 12], S41, 1700485571);
        d = ii(d, a, b, c, x[i + 3], S42, -1894986606);
        c = ii(c, d, a, b, x[i + 10], S43, -1051523);
        b = ii(b, c, d, a, x[i + 1], S44, -2054922799);
        a = ii(a, b, c, d, x[i + 8], S41, 1873313359);
        d = ii(d, a, b, c, x[i + 15], S42, -30611744);
        c = ii(c, d, a, b, x[i + 6], S43, -1560198380);
        b = ii(b, c, d, a, x[i + 13], S44, 1309151649);
        a = ii(a, b, c, d, x[i + 4], S41, -145523070);
        d = ii(d, a, b, c, x[i + 11], S42, -1120210379);
        c = ii(c, d, a, b, x[i + 2], S43, 718787259);
        b = ii(b, c, d, a, x[i + 9], S44, -343485551);

        a = ad(a, AA); b = ad(b, BB); c = ad(c, CC); d = ad(d, DD);
    }
    return rh(a) + rh(b) + rh(c) + rh(d);
}
