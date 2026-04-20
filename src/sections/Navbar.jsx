import React, { useRef, useState, useEffect } from "react";
import { socials } from "../constants";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-scroll";

export default function Navbar() {
  // ============================================================
  // useRef() — React Hook
  // ============================================================
  // useRef() digunakan untuk menyimpan referensi langsung ke elemen DOM
  // atau nilai yang ingin kita "ingat" tanpa memicu re-render saat nilainya berubah.
  //
  // Cara kerja:
  // - useRef() mengembalikan sebuah object { current: <nilai> }
  // - Untuk menghubungkan ke elemen DOM, kita pasang prop `ref={namaRef}` ke elemen HTML/JSX
  // - Setelah komponen di-render, `namaRef.current` akan berisi elemen DOM aslinya
  // - Berbeda dengan useState, mengubah `.current` TIDAK memicu re-render komponen
  //
  // Contoh penggunaan di bawah:
  // navRef.current → elemen <nav> di DOM
  // topLineRef.current → elemen <span> garis atas burger button
  // ============================================================

  // Referensi ke elemen <nav> — dipakai GSAP untuk animasi slide in/out
  const navRef = useRef(null);

  // Referensi ke array elemen link navigasi (home, services, about, dst.)
  // Diinisialisasi dengan [] agar bisa diisi satu per satu lewat callback ref
  const linksRef = useRef([]);

  // Referensi ke elemen kontak di bagian bawah navbar
  const contactRef = useRef(null);

  // Referensi ke garis atas (─) pada ikon burger/hamburger
  const topLineRef = useRef(null);

  // Referensi ke garis bawah (─) pada ikon burger/hamburger
  const bottomLineRef = useRef(null);

  // ============================================================
  // useRef() untuk menyimpan GSAP Timeline
  // ============================================================
  // Selain DOM element, useRef juga sering dipakai untuk menyimpan
  // nilai "persisten" yang tidak perlu memicu re-render.
  //
  // Di sini kita simpan instance GSAP Timeline agar bisa diakses
  // di luar useGSAP (misalnya di dalam fungsi toggleMenu).
  // Kalau pakai variabel biasa (let tl), nilainya akan hilang
  // setiap kali komponen re-render.
  // ============================================================

  // Menyimpan GSAP Timeline untuk animasi buka/tutup panel navbar
  const tl = useRef(null);

  // Menyimpan GSAP Timeline untuk animasi ikon burger → tanda silang (X)
  const iconTl = useRef(null);

  // ============================================================
  // useState() — React Hook
  // ============================================================
  // useState() digunakan untuk menyimpan state (data) di dalam komponen.
  // Setiap kali state berubah, React akan otomatis me-render ulang komponen
  // sehingga tampilan selalu sinkron dengan data terbaru.
  //
  // Sintaks: const [nilaiState, fungsiPengubah] = useState(nilaiAwal)
  // - nilaiState   → nilai state saat ini (read-only, jangan diubah langsung)
  // - fungsiPengubah → fungsi yang harus dipanggil untuk mengubah state
  // - nilaiAwal    → nilai state pertama kali komponen dimuat
  //
  // Perbedaan dengan useRef:
  // - useState → perubahan nilai AKAN memicu re-render (cocok untuk tampilan)
  // - useRef   → perubahan nilai TIDAK memicu re-render (cocok untuk referensi internal)
  // ============================================================

  // State untuk mengontrol apakah tombol burger ditampilkan atau disembunyikan.
  // true = tampil (clipPath circle 50%), false = tersembunyi (clipPath circle 0%)
  // Diinisialisasi `true` agar burger langsung terlihat saat halaman pertama kali dimuat,
  // karena posisi scroll awal = 0 (di atas halaman), seharusnya burger memang tampil.
  // Nilainya berubah berdasarkan arah scroll pengguna (lihat useEffect di bawah)
  const [showBurger, setShowBurger] = useState(() => window.scrollY < 10);

  // State untuk melacak apakah menu navbar sedang terbuka atau tertutup.
  // false = menu tertutup, true = menu terbuka
  // Dipakai di toggleMenu() untuk menentukan apakah GSAP harus .play() atau .reverse()
  const [isOpen, setIsOpen] = useState(false);

  // ============================================================
  // useGSAP() — Custom Hook dari library @gsap/react
  // ============================================================
  // useGSAP() adalah versi "React-friendly" dari GSAP untuk membuat animasi.
  // Fungsinya mirip seperti useEffect, tapi khusus dioptimalkan untuk GSAP:
  //
  // - Otomatis membersihkan (cleanup) semua animasi GSAP saat komponen di-unmount
  //   sehingga tidak ada memory leak atau animasi yang "nyasar"
  // - Memastikan animasi GSAP dijalankan setelah DOM benar-benar siap
  // - Parameter kedua `[]` (dependency array kosong) berarti animasi ini hanya
  //   diinisialisasi SEKALI, saat komponen pertama kali dimuat (sama seperti useEffect)
  //
  // Apa yang dilakukan di dalam useGSAP ini:
  // 1. Mengatur posisi awal navbar (di luar layar, sebelah kanan)
  // 2. Mendefinisikan timeline animasi untuk buka menu (tl)
  // 3. Mendefinisikan timeline animasi untuk ikon burger → X (iconTl)
  // ============================================================

  useGSAP(() => {
    // Set posisi awal navbar: geser 100% ke kanan (keluar dari layar)
    // Ini adalah kondisi "menu tertutup" — navbar tidak terlihat
    gsap.set(navRef.current, { xPercent: 100 });

    // Set kondisi awal semua link dan kontak: tak terlihat (autoAlpha: 0)
    // dan sedikit geser ke kiri (x: -20) sebagai efek awal animasi masuk
    gsap.set([linksRef.current, contactRef.current], { autoAlpha: 0, x: -20 });

    // ── Timeline untuk animasi BUKA menu ──────────────────────
    // .timeline({ paused: true }) → animasi tidak langsung jalan,
    // harus dipanggil manual dengan .play() atau .reverse()
    tl.current = gsap
      .timeline({ paused: true })

      // Langkah 1: Geser panel navbar masuk dari kanan ke posisi normal
      .to(navRef.current, {
        xPercent: 0, // kembali ke posisi x: 0 (tampil di layar)
        duration: 1,
        ease: "power3.out",
      })

      // Langkah 2: Munculkan semua link satu per satu dengan efek stagger
      // "<" artinya mulai bersamaan dengan animasi sebelumnya (Langkah 1)
      .to(
        linksRef.current,
        {
          autoAlpha: 1, // opacity 1 + visibility visible
          x: 0, // kembali ke posisi x normal
          stagger: 0.1, // setiap link muncul dengan jeda 0.1 detik
          duration: 0.5,
          ease: "power2.out",
        },
        "<",
      )

      // Langkah 3: Munculkan bagian kontak sedikit setelah link
      // "<+0.2" artinya mulai 0.2 detik setelah Langkah 2 dimulai
      .to(
        contactRef.current,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "<+0.2",
      );

    // ── Timeline untuk animasi ikon BURGER → tanda X ──────────
    iconTl.current = gsap
      .timeline({ paused: true })

      // Rotasi garis atas 45° dan geser sedikit ke bawah → membentuk "/"
      .to(topLineRef.current, {
        rotate: 45,
        y: 3.3,
        duration: 0.3,
        ease: "power2.inOut",
      })

      // Rotasi garis bawah -45° dan geser sedikit ke atas → membentuk "\"
      // "<" artinya animasi ini berjalan bersamaan dengan animasi garis atas
      .to(
        bottomLineRef.current,
        {
          rotate: -45,
          y: -3.3,
          duration: 0.3,
          ease: "power2.inOut",
        },
        "<",
      );
  }, []); // dependency array kosong → hanya dijalankan sekali saat mount

  // ============================================================
  // useEffect() — React Hook
  // ============================================================
  // useEffect() digunakan untuk menjalankan "efek samping" (side effects)
  // di luar proses render React. Side effects adalah hal-hal yang berinteraksi
  // dengan dunia luar komponen, seperti:
  // - Event listener (scroll, resize, click)
  // - Fetch data dari API
  // - Manipulasi DOM langsung
  // - Set interval / setTimeout
  //
  // Sintaks:
  //   useEffect(() => {
  //     // kode efek samping di sini
  //     return () => { /* cleanup saat komponen unmount */ }
  //   }, [dependency])
  //
  // Dependency Array `[]`:
  // - []        → hanya jalan SEKALI saat komponen pertama kali mount
  // - [a, b]    → jalan ulang setiap kali nilai `a` atau `b` berubah
  // - (kosong)  → jalan setiap kali komponen re-render (jarang dipakai)
  //
  // Cleanup Function (return):
  // - Dijalankan saat komponen akan di-unmount (dihapus dari DOM)
  // - Penting untuk menghindari memory leak, misalnya: menghapus event listener
  //
  // Apa yang dilakukan useEffect di bawah:
  // Memantau arah scroll pengguna. Jika scroll ke atas (atau posisi < 10px),
  // tampilkan tombol burger. Jika scroll ke bawah, sembunyikan tombol burger.
  // ============================================================

  useEffect(() => {
    // Simpan posisi scroll terakhir sebagai acuan perbandingan arah scroll
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Logika menampilkan/menyembunyikan burger button:
      // - Tampil (true) jika: scroll ke ATAS (current <= last) ATAU posisi sangat atas (< 10px)
      // - Sembunyikan (false) jika: scroll ke BAWAH
      // setShowBurger memanggil useState setter → memicu re-render agar tampilan update
      setShowBurger(currentScrollY <= lastScrollY || currentScrollY < 10);

      // Update posisi scroll terakhir untuk perbandingan berikutnya
      lastScrollY = currentScrollY;
    };

    // Daftarkan event listener scroll ke window
    // { passive: true } → memberitahu browser bahwa kita tidak akan memanggil
    // preventDefault() di dalam handler ini, sehingga browser bisa mengoptimalkan
    // performa scroll (tidak perlu menunggu JS selesai sebelum scroll)
    window.addEventListener("scroll", handleScroll, { passive: true });

    // ── Cleanup Function ──────────────────────────────────────
    // Fungsi yang di-return dari useEffect akan dipanggil saat:
    // 1. Komponen di-unmount (dihapus dari halaman)
    // 2. Sebelum efek dijalankan ulang (jika ada dependency yang berubah)
    //
    // Di sini kita hapus event listener agar tidak terjadi memory leak.
    // Tanpa cleanup ini, setiap kali komponen mount → event listener baru ditambahkan,
    // tapi yang lama tidak dihapus → bisa tumpuk dan memperlambat app.
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // dependency array kosong → event listener hanya didaftarkan sekali saat mount

  // ============================================================
  // toggleMenu — Fungsi biasa (bukan hook)
  // ============================================================
  // Fungsi ini dipanggil saat pengguna klik tombol burger.
  // Menggunakan nilai state `isOpen` untuk menentukan aksi GSAP:
  // - Jika menu sedang terbuka → jalankan .reverse() untuk menutup
  // - Jika menu sedang tertutup → jalankan .play() untuk membuka
  // Lalu toggle nilai `isOpen` menggunakan setIsOpen (dari useState)
  // ============================================================

  const toggleMenu = () => {
    if (isOpen) {
      tl.current.reverse(); // Animasi navbar keluar (balik ke kanan)
      iconTl.current.reverse(); // Animasi ikon X → burger
    } else {
      tl.current.play(); // Animasi navbar masuk dari kanan
      iconTl.current.play(); // Animasi ikon burger → X
    }
    // Balik nilai isOpen: true → false, atau false → true
    // Ini memicu re-render, tapi hanya minimal (hanya state yang relevan)
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Panel navbar — terhubung ke navRef agar GSAP bisa menganimasikannya */}
      <nav
        ref={navRef}
        className="fixed z-50 flex flex-col justify-between w-full h-full px-10 uppercase bg-black text-white/80 py-28 gap-y-10 md:w-1/2 md:left-1/2"
      >
        <div className="flex flex-col text-5xl gap-y-2 md:text-6xl lg:text-8xl">
          {["home", "services", "about", "work", "contact"].map(
            (section, index) => (
              // Callback ref: `ref={(el) => (linksRef.current[index] = el)}`
              // Ini adalah cara menyimpan banyak ref ke dalam satu array.
              // Setiap elemen <div> link akan disimpan di linksRef.current[0], [1], dst.
              // Sehingga GSAP bisa menganimasikan semua link sekaligus dengan stagger.
              <div key={index} ref={(el) => (linksRef.current[index] = el)}>
                <Link
                  to={`${section}`}
                  smooth
                  offset={0}
                  duration={2000}
                  className="transition=all duration-300 cursor-pointer hover:text-white"
                >
                  {section}
                </Link>
              </div>
            ),
          )}
        </div>

        {/* Bagian kontak — terhubung ke contactRef agar GSAP bisa menganimasikannya */}
        <div
          ref={contactRef}
          className="flex flex-col flex-wrap justify-between gap-8 md:flex-row"
        >
          <div className="font-light">
            <p className="tracking-wider text-white/50">E-mail</p>
            <p className="tracking-widest text-xl lowercase">
              nauvaldzakwanbaihaqi@gmail.com
            </p>
          </div>
          <div className="font-light">
            <p className="tracking-wider text-white/50">Social Media</p>
            <div className="flex flex-col flex-wrap md:flex=row gap-x-2">
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-sm leading-loose tracking-widest uppercase hover:text-white transition-colors duration-300"
                >
                  {"{"}
                  {social.name}
                  {"}"}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Tombol burger/hamburger
          - showBurger (dari useState) mengontrol tampil/tidaknya via clipPath
          - topLineRef & bottomLineRef terhubung ke GSAP untuk animasi → tanda X */}
      <div
        className="fixed z-50 flex flex-col items-center justify-center gap-1 transition-all duration-300 bg-black rounded-full cursor-pointer w-14 h-14 md:w-20 md:h-20 top-4 right-10"
        onClick={toggleMenu}
        style={
          // Kondisional style berdasarkan state showBurger:
          // true  → circle(50%) = tombol bulat penuh, terlihat
          // false → circle(0%)  = tidak terlihat (disembunyikan dengan clip)
          showBurger
            ? { clipPath: "circle(50% at 50% 50%)" }
            : { clipPath: "circle(0% at 50% 50%)" }
        }
      >
        {/* Garis atas burger — terhubung ke topLineRef untuk animasi GSAP */}
        <span
          ref={topLineRef}
          className="block w-8 h-0.5 bg-white rounded-full origin-center"
        ></span>

        {/* Garis bawah burger — terhubung ke bottomLineRef untuk animasi GSAP */}
        <span
          ref={bottomLineRef}
          className="block w-8 h-0.5 bg-white rounded-full origin-center"
        ></span>
      </div>
    </>
  );
}
