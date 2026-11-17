# Pengujian Tryout PPG

## Lulus

| Pemeriksaan | Hasil |
| --- | --- |
| Konten sumber | 156 halaman dalam 4 PDF dirender untuk audit. Teks soal, pilihan, pernyataan, kunci, dan pembahasan dicocokkan melalui dua ekstraksi independen. Seluruh paket berisi 80 soal. |
| Penilaian | Set jawaban yang identik dengan kunci PDF menghasilkan 80 benar dan nilai 100 pada setiap paket. Pengujian mesin menolak set MCMA yang kurang atau berlebih, matriks yang tidak cocok, dan kunci yang tidak valid. |
| Akses paket | Keempat paket terbuka di browser. Tiga nomor pertama Simulasi memakai radio, kategori per pernyataan, lalu checkbox. |
| Katalog beranda | Empat kartu dan tombolnya tampil sekaligus pada 1366 × 768. Katalog diuji juga pada lebar 390 px tanpa gulir mendatar. Filter dan pencarian dapat dipakai bersamaan. Detail dan konfirmasi mulai ulang tampil di beranda. Tombol mulai membuka ujian langsung, sesi lama membuka nomor aktif yang tersimpan, dan hasil selesai dapat dibuka kembali. Katalog menampilkan dan mencari dalam 28 paket pada salinan uji, termasuk 24 paket tambahan sementara. |
| Respons | PG memilih satu opsi. MCMA mengizinkan beberapa pilihan sekaligus dan menghapus pilihan secara independen. Nomor 51 PGK MCMA membatasi maksimal empat pilihan. Dua dari empat respons Kategori tetap tersimpan sebagai jawaban parsial. |
| Navigasi dan sesi | Tombol maju, mundur, dan lompatan nomor bekerja. Browser memulihkan nomor aktif, pilihan dan waktu dari sesi yang sama setelah refresh. Tanda ragu-ragu tidak menghapus pilihan. Mulai ulang PG Biasa memulai timer baru dan mempertahankan sesi Kategori. |
| Akhir pengerjaan | Navigasi Back di dalam situs kembali ke sesi aktif. Di nomor terakhir, navigasi maju nonaktif. Uji browser dengan salinan sementara berdurasi pendek menunggu waktu habis dan membuka hasil secara otomatis. Perhitungan satu jawaban benar dari 80 menghasilkan 1,25. |
| Jeda | Klik Jeda menghentikan hitung mundur. Setelah refresh, sisa waktu sama dan dialog jeda masih terbuka. Lanjutkan Tryout memulihkan nomor aktif. Uji mesin memeriksa jeda berulang, sinkronisasi antartab, penyimpanan sesi lama, dan waktu habis sebelum jeda sempat dimulai. |
| Format tambahan | Data uji sementara memeriksa dropdown pasangan, tombol pengurutan, isian teks dan angka dengan koma desimal, uraian beberapa baris setelah refresh, serta soal komposit. Lima soal yang memiliki kunci dinilai dan satu uraian tanpa rubrik dikecualikan dari nilai akhir. |
| Penyimpanan | Uji mesin mencakup waktu habis saat muat ulang, pembatasan penyimpanan browser, data lama setelah bank berubah, dan sesi terpisah antar paket. |
| Tata letak | Diperiksa pada viewport desktop sekitar 1672 × 940, 1440 × 900 dan 1366 × 768, tablet sekitar 820 × 1180, serta ponsel sekitar 390 × 844. Drawer soal dapat dibuka, ditutup dan dipakai untuk melompat nomor. Matriks ponsel tetap berada dalam lebar layar. |
| Panel ujian tetap | Posisi progres, daftar, dan navigasi bawah tetap sama saat jawaban digulir. Pada desktop 1366 × 768, judul situs hilang dari layar ujian, kelima opsi PGK MCMA nomor 1 terlihat sekaligus, dan panel kanan selebar 246 px sejajar dengan navigasi bawah. Pada ponsel sekitar 390 × 844, timer dan Jeda berada dekat tombol Daftar Soal. Kedua tampilan memuat 40 nomor per halaman. |
| Teks soal dan opsi terpisah | PG Biasa nomor 1 dan keempat opsinya muat tanpa gulir pada 1366 × 768. Pada 1366 × 600, opsi dapat digulir sampai akhir sementara teks tetap terlihat. Pada ponsel sekitar 390 × 620, bacaan dan opsi PGK MCMA nomor 1 bergulir sendiri-sendiri. Opsi terakhir dapat dipilih, tanda ragu mempertahankan posisi gulir, pindah soal mengembalikan kedua bagian ke atas, dan pembahasan tampil di area jawaban. |
| Aset statis | Beranda, ilustrasi, bank soal, dan navigasi dibuka melalui localhost di subpath /tryout-ppg/ tanpa kesalahan konsol pada pemeriksaan akhir. |

## Batas verifikasi

Perbandingan piksel dengan dua gambar acuan belum dapat dilakukan karena kedua berkas gambar tidak tersedia. Tampilan mengikuti spesifikasi tertulis master prompt. Pengujian interaktif dilakukan melalui localhost. Browser pratinjau tidak mengizinkan protokol berkas lokal, sehingga cara buka langsung belum diuji di sana. Publikasi GitHub Pages belum dilakukan.
