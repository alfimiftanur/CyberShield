# Stored XSS — Comment Guestbook

## Vulnerability

Fitur comment/guestbook di endpoint `/lab/xss/vulnerable/comment` menyimpan input user ke database tanpa sanitasi, lalu merendernya sebagai HTML mentah menggunakan `dangerouslySetInnerHTML` di sisi React:

```jsx
<span dangerouslySetInnerHTML={{ __html: c.body }} />
```

Ini memungkinkan penyerang menyisipkan HTML/JavaScript arbitrary yang akan dieksekusi oleh browser setiap kali halaman dibuka.

## Impact

- **Eksekusi JavaScript arbitrary** di browser korban — setiap user yang membuka halaman akan terkena payload
- **Session hijacking** — payload bisa mencuri cookie session (`document.cookie`) dan mengirimkan ke server attacker
- **Defacement** — payload bisa mengubah tampilan halaman
- **Phishing** — payload bisa redirect korban ke halaman palsu

Tingkat keparahan: **High** — karena payload tersimpan di database dan menyerang semua user yang membuka halaman, bukan hanya korban yang klik link tertentu (berbeda dari Reflected XSS).

## Proof of Concept

**Payload:** `<img src=x onerror="alert('XSS')">`

Payload diisi di field "body" pada form comment Vulnerable Endpoint.

**Mengapa `<script>alert(1)</script>` tidak dipakai:**
Browser modern tidak mengeksekusi script tag yang diinjeksi via `innerHTML`/`dangerouslySetInnerHTML` — ini perilaku keamanan browser itu sendiri. Payload yang benar menggunakan event handler seperti `onerror` yang tetap dieksekusi meskipun injeksi lewat innerHTML.

**Cara kerja payload:**
1. `<img src=x>` — browser coba load gambar dari URL `x` yang tidak valid
2. Load gagal → browser trigger event `onerror`
3. `onerror="alert('XSS')"` → JavaScript dieksekusi

**Hasil:** [Screenshot alert muncul di Vulnerable Endpoint](../images/xss-vuln.png)

## Remediation

Endpoint `/lab/xss/fixed/comment` menyimpan data dengan cara yang sama, tapi merendernya sebagai teks biasa menggunakan React:

```jsx
<span>{c.body}</span>
```

React secara default melakukan **HTML escaping** pada semua teks yang dirender dengan sintaks `{}` — karakter seperti `<`, `>`, `"` dikonversi menjadi HTML entities (`&lt;`, `&gt;`, `&quot;`) sehingga tidak diinterpretasikan sebagai HTML oleh browser.

**Hasil setelah fix:** [Screenshot payload tampil sebagai teks literal](../images/xss-fixed.png)

## Pelajaran

- `dangerouslySetInnerHTML` di React **harus dihindari** untuk input yang berasal dari user — nama fungsinya sendiri sudah memperingatkan ini.
- Mitigasi XSS ada di titik **render/output**, bukan di titik **input** — menyimpan data mentah ke database itu tidak masalah selama render-nya aman.
- Untuk kasus yang memang butuh render HTML (misal rich text editor), gunakan library sanitasi seperti **DOMPurify** sebelum render: `dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(c.body) }}`.
- Implementasikan **Content Security Policy (CSP)** sebagai defense-in-depth — ini akan memblokir eksekusi inline script meskipun XSS berhasil diinjeksi.
