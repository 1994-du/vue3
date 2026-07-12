<template>
    首页
</template>

<script setup lang="ts">
function sm3(message) {

    function rotl(x, n) {
        return (x << n) | (x >>> (32 - n))
    }


    function P0(x) {
        return x ^ rotl(x, 9) ^ rotl(x, 17)
    }


    function P1(x) {
        return x ^ rotl(x, 15) ^ rotl(x, 23)
    }


    function FF(x, y, z, j) {
        return j <= 15
            ? x ^ y ^ z
            : (x & y) | (x & z) | (y & z)
    }


    function GG(x, y, z, j) {
        return j <= 15
            ? x ^ y ^ z
            : (x & y) | (~x & z)
    }


    function add(x, y) {
        return (x + y) >>> 0
    }


    const T = []

    for (let i = 0; i < 64; i++) {
        T[i] = (
            i <= 15
                ? rotl(0x79cc4519, i)
                : rotl(0x7a879d8a, i)
        ) >>> 0
    }


    const IV = [
        0x7380166f,
        0x4914b2b9,
        0x172442d7,
        0xda8a0600,
        0xa96f30bc,
        0x163138aa,
        0xe38dee4d,
        0xb0fb0e4e
    ]


    // UTF8编码
    const bytes = Array.from(
        new TextEncoder().encode(message)
    )


    // 填充
    const bitLen = bytes.length * 8

    bytes.push(0x80)

    while ((bytes.length * 8) % 512 !== 448) {
        bytes.push(0)
    }


    for (let i = 7; i >= 0; i--) {
        bytes.push(
            (bitLen >>> (i * 8)) & 0xff
        )
    }


    let V = IV.slice()


    // 分组处理
    for (let offset = 0; offset < bytes.length; offset += 64) {


        const block = bytes.slice(
            offset,
            offset + 64
        )


        const W = []


        for (let i = 0; i < 16; i++) {

            W[i] =
                (
                    (block[i * 4] << 24) |
                    (block[i * 4 + 1] << 16) |
                    (block[i * 4 + 2] << 8) |
                    block[i * 4 + 3]
                ) >>> 0
        }


        for (let i = 16; i < 68; i++) {

            W[i] =
                (
                    P1(
                        W[i - 16] ^
                        W[i - 9] ^
                        rotl(W[i - 3], 15)
                    )
                    ^
                    rotl(W[i - 13], 7)
                    ^
                    W[i - 6]
                ) >>> 0
        }


        const W1 = []

        for (let i = 0; i < 64; i++) {
            W1[i] = W[i] ^ W[i + 4]
        }


        let [
            A,
            B,
            C,
            D,
            E,
            F,
            G,
            H
        ] = V


        for (let j = 0; j < 64; j++) {


            const SS1 = rotl(
                add(
                    add(
                        rotl(A, 12),
                        E
                    ),
                    T[j]
                ),
                7
            )


            const SS2 = SS1 ^ rotl(A, 12)


            const TT1 = add(
                add(
                    add(
                        FF(A, B, C, j),
                        D
                    ),
                    SS2
                ),
                W1[j]
            )


            const TT2 = add(
                add(
                    add(
                        GG(E, F, G, j),
                        H
                    ),
                    SS1
                ),
                W[j]
            )


            D = C
            C = rotl(B, 9)
            B = A
            A = TT1 >>> 0


            H = G
            G = rotl(F, 19)
            F = E
            E = P0(TT2) >>> 0
        }


        V = [
            A ^ V[0],
            B ^ V[1],
            C ^ V[2],
            D ^ V[3],
            E ^ V[4],
            F ^ V[5],
            G ^ V[6],
            H ^ V[7]
        ].map(v => v >>> 0)

    }


    return V.map(
        v => v.toString(16).padStart(8, '0')
    ).join('')
}
console.log(sm3('abc'));

</script>

<style lang='scss' scoped>

</style>
