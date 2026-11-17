# Tryout PPG

Website statis latihan mandiri UTBK UKPPPG. Paket latihan di beranda dipisahkan menjadi **Umum** (Pedagogi Umum) dan **Program Studi** (PCK bidang studi: **PGSD** dan **Teknik Mesin**). Gunakan filter kategori, program studi, format, atau pencarian untuk menemukan paket, lalu klik kartunya untuk membuka pop-up dan menekan **Mulai Tryout**.

| Kategori | Paket | Soal per paket | Cara menjawab |
| --- | --- | ---: | --- |
| Umum (Pedagogi Umum) | Pilihan Ganda, PGK Kategori, PGK MCMA, Simulasi | 30 | Sesuai format tiap paket. |
| Program Studi — PGSD (PCK) | Pilihan Ganda, PGK Kategori, PGK MCMA, Simulasi | 50 | Sesuai format tiap paket. |
| Program Studi — Teknik Mesin (PCK) | Segera hadir | — | Siap diisi melalui `data/questions.js`. |

Tiap paket menyimpan pengerjaan dan hasilnya sendiri di browser. Durasi latihan adalah **50 menit** untuk paket berisi **30 soal** (Umum / Pedagogi Umum) dan **90 menit** untuk paket berisi **50 soal** (PCK Bidang Studi). Saat ujian, tekan **Jeda** untuk menghentikan sementara hitung mundur, lalu **Lanjutkan Tryout** untuk kembali ke soal yang sama. Jeda tersimpan setelah refresh. Jika halaman ditutup tanpa dijeda, timer terus berjalan. Saat kembali dari beranda, pilih paket yang sama lalu **Lanjutkan Pengerjaan**. Gunakan **Mulai Ulang** untuk mengganti sesi lama paket itu dengan sesi baru.

## Buka di PC

1. Ekstrak ZIP dengan **Extract All** dan pertahankan susunan folder.
2. Buka **index.html** dengan Chrome, Edge, atau Firefox. Semua aset ikut dalam proyek.
3. Jika browser membatasi penyimpanan untuk berkas lokal, gunakan server statis. Buka PowerShell di folder yang berisi **index.html**, lalu jalankan perintah berikut.

~~~powershell
python -m http.server 8000 --bind 127.0.0.1
~~~

Buka **http://localhost:8000/**. Tekan **Ctrl+C** di PowerShell ketika selesai. Gunakan URL yang sama untuk membuka kembali sesi. Browser memisahkan penyimpanan tiap alamat, termasuk saat berpindah dari berkas lokal ke localhost atau GitHub Pages.

Komputer tanpa Python dapat langsung membuka **index.html**. Jika ingin menjalankan server lokal, pasang Python dari [halaman unduhan resmi untuk Windows](https://www.python.org/downloads/windows/).

## Publikasikan di GitHub Pages

1. Buat repositori GitHub, misalnya **tryout-ppg**.
2. Unggah isi folder proyek ke cabang **main**. Tempatkan **index.html**, **.nojekyll**, **assets**, **data**, **js**, dan **styles** di akar repositori.
3. Buka **Settings → Pages**. Pilih **Deploy from a branch**, cabang **main**, dan folder **/(root)**, lalu simpan.
4. Setelah Pages selesai, buka **Visit site** dari halaman pengaturan. Contoh alamatnya **https://NAMAUSER.github.io/tryout-ppg/**. Coba mulai satu paket dan pastikan ilustrasi, opsi, daftar soal, dan halaman hasil tampil.

[Dokumentasi resmi GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Pengerjaan dan nilai

- Layar ujian dimulai dari progres. Timer dan tombol **Jeda** berada dekat **Daftar Soal**. Hasil terbuka otomatis saat waktu habis.
- Teks soal dan pilihan jawaban berada di dua bagian dalam kartu. Jika ruang terbatas, gulir pilihan tanpa menggeser teks. Bacaan panjang bisa digulir sendiri. Pada soal yang muat, kedua bagian terlihat penuh. Progres, daftar soal desktop, dan tombol navigasi bawah tetap terlihat. Daftar soal menampilkan 40 nomor per halaman. Di ponsel, buka daftar lewat tombol **Daftar Soal** di atas kartu.
- Warna grid mengikuti status utama yang eksklusif. Urutannya **ragu-ragu**, **dijawab tuntas**, dan **belum tuntas**. Soal aktif mendapat outline. Progres menghitung semua jawaban tuntas, termasuk yang ditandai ragu-ragu.
- Semua soal bernilai satu poin. PG dicocokkan dengan satu opsi kunci. MCMA harus cocok tepat dengan kumpulan opsi kunci. PGK Kategori harus tepat pada seluruh pernyataan. Nilai dihitung dengan **poin diperoleh ÷ poin maksimum × 100**.
- Ringkasan hasil memisahkan jawaban benar, salah, dan kosong atau belum tuntas. Jika paket yang ditambahkan kelak memiliki kunci tidak lengkap, website menampilkan cakupan penilaian dan daftar nomor yang belum bisa dinilai.
- Jawaban dan nilai diproses serta disimpan lokal di browser. Kunci dan pembahasan terdapat dalam data situs statis dan dapat dilihat melalui DevTools.

## Berkas proyek

- **data/questions.js** adalah bank soal, kunci, dan pembahasan. Ubah **durationMinutes** di objek paket untuk mengganti durasi latihan.
- **js/engine.js** menangani sesi, validasi jawaban, timer, dan skor. **js/app.js** mengelola halaman. **js/catalog.js** membangun katalog. **js/question-view.js** merender isi soal dan kontrol jawaban.
- **assets/illustrations/hero-laptop.webp** adalah ilustrasi transparan yang dibuat dengan ImageGen bawaan dari brief laptop perak dengan antarmuka kuis biru-putih, buku biru-putih, dan tanaman pot.
- [Ringkasan audit PDF](audit/README.md) dan [audit per soal](audit/konversi.csv) mencatat paket, halaman sumber, format, serta kunci dan pembahasan. [Laporan uji](audit/pengujian.md) berisi hasil pemeriksaan tampilan dan fungsi.

## Menambah paket

1. Konversi soal dari PDF ke bentuk yang sama dengan paket yang sudah ada di **data/questions.js**.
2. Jika menambah program studi baru, daftarkan objeknya di **TRYOUT_PROGRAMS** (misalnya `{ id: "teknik-mesin", label: "Teknik Mesin", fullName: "Pendidikan Teknik Mesin", subtitle: "PCK Pendidikan Teknik Mesin" }`).
3. Tambahkan objek paket pada daftar **TRYOUT_PACKS**. Isi **id** yang unik, **category** (`"umum"` atau `"prodi"`), **programId** (untuk `"prodi"`, misalnya `"teknik-mesin"`), **groupLabel**, **title**, **description**, **durationMinutes**, dan **questions**. Gunakan ID yang sama untuk paket yang sama agar sesi dapat dikenali.
4. Muat ulang beranda. Kartu, jumlah paket dan soal, tab program studi, serta filter format mengikuti isi bank. Katalog mengelompokkan paket dari tipe soalnya. Paket dengan beberapa tipe masuk ke **Simulasi Campuran**.
