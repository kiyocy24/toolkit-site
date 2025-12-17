
export interface JwtHeader {
    alg?: string
    typ?: string
    [key: string]: unknown
}

export interface JwtPayload {
    [key: string]: unknown
}

export async function signJwt(headerObj: JwtHeader, payloadObj: JwtPayload, secret: string): Promise<string> {
    const base64UrlEncode = (str: string) => {
        return btoa(str)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "")
    }

    const utf8ToUint8Array = (str: string) => {
        return new TextEncoder().encode(str)
    }

    const encodedHeader = base64UrlEncode(JSON.stringify(headerObj))
    const encodedPayload = base64UrlEncode(JSON.stringify(payloadObj))

    const unsignedToken = `${encodedHeader}.${encodedPayload}`

    if (headerObj.alg === "none") {
        return `${unsignedToken}.`
    }

    if (headerObj.alg !== "HS256") {
        throw new Error("Only HS256 (and none) algorithm is currently supported in this client-side demo.")
    }

    if (!secret) {
        throw new Error("Please provide a secret for HS256 signing.")
    }

    const keyData = utf8ToUint8Array(secret)
    const key = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    )

    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        utf8ToUint8Array(unsignedToken)
    )

    // Convert array buffer to base64url
    const signatureArray = Array.from(new Uint8Array(signature))
    const signatureBase64 = btoa(String.fromCharCode.apply(null, signatureArray))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")

    return `${unsignedToken}.${signatureBase64}`
}
