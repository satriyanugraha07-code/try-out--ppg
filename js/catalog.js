(() => {
  'use strict';

  const formats = {
    single: { label: 'PG Biasa', icon: 'single' },
    category: { label: 'PGK Kategori', icon: 'category' },
    multiple: { label: 'PGK MCMA', icon: 'multiple' },
    mixed: { label: 'Simulasi Campuran', icon: 'simulation' },
    essay: { label: 'Uraian', icon: 'list' },
    other: { label: 'Format Lain', icon: 'list' }
  };
  const aliases = { single_choice: 'single', statement_matrix: 'category', multiple_select: 'multiple' };
  const numbers = new Intl.NumberFormat('id-ID');

  const umumCardThemes = {
    single: {
      blobA: '#c7ddfe',
      blobB: '#d9e8ff',
      arcColor: '#7fa7ee',
      arcPath: 'M54 -6 C74 36, 128 52, 184 26',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<path d="M70 11l3-6M77 16l6-3M80 24l6 1" stroke="#2c6be0" stroke-width="2" stroke-linecap="round"/>' +
        '<g transform="translate(44 45) rotate(-9) translate(-44 -45)">' +
        '<rect x="20" y="13" width="46" height="58" rx="8" fill="#c7ddfd"/>' +
        '<rect x="17" y="11" width="46" height="58" rx="8" fill="#ffffff" stroke="#1d4282" stroke-width="2"/>' +
        '<rect x="29" y="7" width="22" height="7" rx="3.5" fill="#9bc0fb" stroke="#1d4282" stroke-width="1.8"/>' +
        '<circle cx="28.5" cy="26.5" r="4.8" fill="#d9e8ff" stroke="#1d4282" stroke-width="1.8"/>' +
        '<path d="M26.3 26.6l1.6 1.6 3.2-3.3" stroke="#1d4282" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<rect x="37" y="24.5" width="18" height="4" rx="2" fill="#89b3f7"/>' +
        '<circle cx="28.5" cy="40.5" r="4.8" fill="#ffffff" stroke="#1d4282" stroke-width="1.8"/>' +
        '<rect x="37" y="38.5" width="19" height="4" rx="2" fill="#bdd4fc"/>' +
        '<circle cx="28.5" cy="54.5" r="4.8" fill="#ffffff" stroke="#1d4282" stroke-width="1.8"/>' +
        '<rect x="37" y="52.5" width="14" height="4" rx="2" fill="#bdd4fc"/>' +
        '</g></svg>'
    },
    category: {
      blobA: '#b7ebd6',
      blobB: '#d1f5e6',
      arcColor: '#5db998',
      arcPath: 'M-10 64 C38 28, 96 24, 152 54',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<path d="M12 20a5 5 0 0 1 5-5h17.5a5 5 0 0 1 3.8 1.7l2.9 3.3H68a5 5 0 0 1 5 5v33a5 5 0 0 1-5 5H17a5 5 0 0 1-5-5V20Z" fill="#8bd8bc" stroke="#16644c" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M19 29a5 5 0 0 1 5-5h16.5a5 5 0 0 1 3.7 1.7l2.8 3.1H76a5 5 0 0 1 5 5v30a5 5 0 0 1-5 5H24a5 5 0 0 1-5-5V29Z" fill="#bceddb" stroke="#16644c" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M20 35h59" stroke="#16644c" stroke-width="1.6" stroke-opacity=".24"/>' +
        '</svg>'
    },
    multiple: {
      blobA: '#d9cefc',
      blobB: '#ebe4fe',
      arcColor: '#8d75e3',
      arcPath: 'M-8 72 C46 28, 108 18, 168 26',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<path d="M35 20h15M35 41h15M35 62h15" stroke="#3c2d7c" stroke-width="2" stroke-linecap="round" stroke-dasharray="5 3"/>' +
        '<rect x="14" y="12" width="16" height="16" rx="4" fill="#ddd3fe" stroke="#3c2d7c" stroke-width="2"/>' +
        '<path d="M18 20l2.8 2.8 5.2-5.4" stroke="#3c2d7c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<rect x="14" y="33" width="16" height="16" rx="4" fill="#ddd3fe" stroke="#3c2d7c" stroke-width="2"/>' +
        '<path d="M18 41l2.8 2.8 5.2-5.4" stroke="#3c2d7c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<rect x="14" y="54" width="16" height="16" rx="4" fill="#ddd3fe" stroke="#3c2d7c" stroke-width="2"/>' +
        '<path d="M18 62l2.8 2.8 5.2-5.4" stroke="#3c2d7c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<rect x="55" y="12" width="16" height="16" rx="4" fill="#ddd3fe" stroke="#3c2d7c" stroke-width="2"/>' +
        '<path d="M59 20l2.8 2.8 5.2-5.4" stroke="#3c2d7c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<rect x="55" y="33" width="16" height="16" rx="4" fill="#f6f3ff" stroke="#3c2d7c" stroke-width="2"/>' +
        '<circle cx="63" cy="62" r="8" fill="#f6f3ff" stroke="#3c2d7c" stroke-width="2"/>' +
        '</svg>'
    },
    mixed: {
      blobA: '#fbd7af',
      blobB: '#feead1',
      arcColor: '#dc9349',
      arcPath: 'M-8 56 C44 20, 110 14, 168 34',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<rect x="15" y="13" width="44" height="56" rx="6" fill="#f8c892" stroke="#7d3e11" stroke-width="2"/>' +
        '<path d="M22 14a5 5 0 0 1 5-5h25l12 12v45a5 5 0 0 1-5 5H27a5 5 0 0 1-5-5V14Z" fill="#fde0bc" stroke="#7d3e11" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M52 9v10a2 2 0 0 0 2 2h10" fill="#f5b878" stroke="#7d3e11" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M44 24l-8.5 13h7.5l-2 11 9.5-14h-7.5l1-10Z" fill="#f4993f" stroke="#7d3e11" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M29 55h14M29 61h10" stroke="#7d3e11" stroke-width="2" stroke-linecap="round"/>' +
        '<g transform="translate(65 56)">' +
        '<path d="M10.9,-2.4 L15.3,-2.3 L15.3,2.3 L10.9,2.4 L9.5,6.0 L12.5,9.2 L9.2,12.5 L6.0,9.5 L2.4,10.9 L2.3,15.3 L-2.3,15.3 L-2.4,10.9 L-6.0,9.5 L-9.2,12.5 L-12.5,9.2 L-9.5,6.0 L-10.9,2.4 L-15.3,2.3 L-15.3,-2.3 L-10.9,-2.4 L-9.5,-6.0 L-12.5,-9.2 L-9.2,-12.5 L-6.0,-9.5 L-2.4,-10.9 L-2.3,-15.3 L2.3,-15.3 L2.4,-10.9 L6.0,-9.5 L9.2,-12.5 L12.5,-9.2 L9.5,-6.0 Z" fill="#f6a752" stroke="#7d3e11" stroke-width="2" stroke-linejoin="round"/>' +
        '<circle cx="0" cy="0" r="5.3" fill="#fff5e9" stroke="#7d3e11" stroke-width="2"/>' +
        '</g></svg>'
    },
    other: {
      blobA: '#d2e1f8',
      blobB: '#e6effc',
      arcColor: '#7f9fd3',
      arcPath: 'M-8 60 C46 24, 112 20, 170 38',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<rect x="18" y="13" width="52" height="58" rx="8" fill="#ffffff" stroke="#2c4b81" stroke-width="2"/>' +
        '<rect x="28" y="25" width="32" height="5" rx="2.5" fill="#92b3ec"/>' +
        '<rect x="28" y="38" width="26" height="5" rx="2.5" fill="#bfd4f7"/>' +
        '<rect x="28" y="51" width="20" height="5" rx="2.5" fill="#bfd4f7"/>' +
        '</svg>'
    }
  };

  const pgsdCardThemes = {
    single: {
      blobA: '#a9e6f4',
      blobB: '#d1f3fa',
      arcColor: '#3ea4be',
      arcPath: 'M46 -6 C74 36, 134 46, 194 22',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<path d="M16 24c0-3.3 2.7-6 6-6h18c3.3 0 6 2.7 6 6v36c-3-2.2-6.5-3.2-10-3.2H22c-3.3 0-6 1.5-6 3.2V24Z" fill="#ffffff" stroke="#0d657a" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M76 24c0-3.3-2.7-6-6-6H52c-3.3 0-6 2.7-6 6v36c3-2.2 6.5-3.2 10-3.2h14c3.3 0 6 1.5 6 3.2V24Z" fill="#e6f9fd" stroke="#0d657a" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M24 29h14M24 37h14M24 45h10" stroke="#46b9d4" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="M54 29h14M54 37h12" stroke="#46b9d4" stroke-width="2.2" stroke-linecap="round"/>' +
        '<g transform="translate(68 55) rotate(-32)">' +
        '<rect x="-4" y="-14" width="8" height="22" rx="2" fill="#93dff0" stroke="#0d657a" stroke-width="1.9"/>' +
        '<path d="M-4 8l4 6 4-6Z" fill="#ffffff" stroke="#0d657a" stroke-width="1.9" stroke-linejoin="round"/>' +
        '<path d="M-4 -9h8" stroke="#0d657a" stroke-width="1.8"/>' +
        '</g>' +
        '</svg>'
    },
    category: {
      blobA: '#cae8a4',
      blobB: '#e1f4c8',
      arcColor: '#69a63a',
      arcPath: 'M-8 60 C44 26, 108 22, 166 52',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<path d="M32 60l-6 12M60 60l6 12M46 60v11" stroke="#316616" stroke-width="2.1" stroke-linecap="round"/>' +
        '<rect x="16" y="16" width="60" height="44" rx="7" fill="#b4e482" stroke="#316616" stroke-width="2"/>' +
        '<rect x="21" y="21" width="50" height="34" rx="4" fill="#ffffff" stroke="#316616" stroke-width="1.8"/>' +
        '<rect x="26" y="27" width="12" height="9" rx="2.5" fill="#c9eba0" stroke="#316616" stroke-width="1.7"/>' +
        '<path d="M42 30h23M42 34h16" stroke="#69a63a" stroke-width="2.2" stroke-linecap="round"/>' +
        '<rect x="26" y="41" width="12" height="9" rx="2.5" fill="#e5f6d1" stroke="#316616" stroke-width="1.7"/>' +
        '<path d="M42 44h21M42 48h14" stroke="#9fd16f" stroke-width="2.2" stroke-linecap="round"/>' +
        '</svg>'
    },
    multiple: {
      blobA: '#f7c1d6',
      blobB: '#fce0eb',
      arcColor: '#cc608c',
      arcPath: 'M-8 66 C48 24, 114 20, 174 34',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<rect x="17" y="49" width="48" height="14" rx="4" fill="#f8bad2" stroke="#922653" stroke-width="2"/>' +
        '<path d="M23 56h28" stroke="#922653" stroke-width="1.8" stroke-linecap="round"/>' +
        '<rect x="21" y="34" width="48" height="14" rx="4" fill="#ffffff" stroke="#922653" stroke-width="2"/>' +
        '<path d="M27 41h24" stroke="#d97aa1" stroke-width="2.2" stroke-linecap="round"/>' +
        '<rect x="16" y="19" width="48" height="14" rx="4" fill="#fde3ed" stroke="#922653" stroke-width="2"/>' +
        '<path d="M22 26h26" stroke="#922653" stroke-width="1.8" stroke-linecap="round"/>' +
        '<rect x="61" y="15" width="14" height="44" rx="4" transform="rotate(14 68 37)" fill="#f8bad2" stroke="#922653" stroke-width="2"/>' +
        '<path d="M64 26h5M63 34h5M62 42h5" stroke="#922653" stroke-width="1.8" stroke-linecap="round"/>' +
        '<circle cx="71" cy="60" r="9.5" fill="#ffffff" stroke="#922653" stroke-width="2"/>' +
        '<path d="M67 60.2l2.6 2.6 5.2-5.3" stroke="#922653" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>'
    },
    mixed: {
      blobA: '#c4cffd',
      blobB: '#dfe5fe',
      arcColor: '#667ce0',
      arcPath: 'M-6 58 C48 22, 112 18, 172 36',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<path d="M46 12v11" stroke="#283d8e" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="M46 13h12l-3 4 3 4H46Z" fill="#9fb2fb" stroke="#283d8e" stroke-width="1.7" stroke-linejoin="round"/>' +
        '<path d="M28 36l18-13 18 13v29H28V36Z" fill="#ffffff" stroke="#283d8e" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M16 42h12v23H16V42ZM64 42h12v23H64V42Z" fill="#c7d2fe" stroke="#283d8e" stroke-width="2" stroke-linejoin="round"/>' +
        '<rect x="40" y="48" width="12" height="17" rx="3" fill="#9fb2fb" stroke="#283d8e" stroke-width="1.9"/>' +
        '<circle cx="46" cy="36" r="5" fill="#dfe5fe" stroke="#283d8e" stroke-width="1.8"/>' +
        '<path d="M46 33.5v2.7l2 1.2" stroke="#283d8e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M12 65h68" stroke="#283d8e" stroke-width="2.2" stroke-linecap="round"/>' +
        '</svg>'
    },
    other: {
      blobA: '#c6dff2',
      blobB: '#e1effa',
      arcColor: '#568ab8',
      arcPath: 'M-8 60 C46 24, 112 20, 170 38',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<circle cx="46" cy="42" r="24" fill="#e2f2fc" stroke="#1d5b84" stroke-width="2"/>' +
        '<path d="M36 42h20M46 32v20" stroke="#1d5b84" stroke-width="2.2" stroke-linecap="round"/>' +
        '</svg>'
    }
  };

  const ipaCardThemes = {
    single: {
      blobA: '#a9e6f4',
      blobB: '#d1f3fa',
      arcColor: '#3ea4be',
      arcPath: 'M46 -6 C74 36, 134 46, 194 22',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<path d="M35 14h16v11l14 27a6 6 0 0 1-5.3 9H26.3a6 6 0 0 1-5.3-9l14-27V14Z" fill="#ffffff" stroke="#0d657a" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M32 14h22" stroke="#0d657a" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="M27.5 44 Q35 41 43 44 T58.5 44 L61.5 52.5 Q62.5 58 57 58 H29 Q23.5 58 24.5 52.5 Z" fill="#93dff0"/>' +
        '<circle cx="40" cy="35" r="2.2" fill="#46b9d4"/>' +
        '<circle cx="46" cy="29" r="1.7" fill="#46b9d4"/>' +
        '<circle cx="67" cy="56" r="11" fill="#d3f5fc" stroke="#0d657a" stroke-width="2"/>' +
        '<path d="M62.5 56.2l3 3 6-6.2" stroke="#0d657a" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>'
    },
    category: {
      blobA: '#cae8a4',
      blobB: '#e1f4c8',
      arcColor: '#69a63a',
      arcPath: 'M-8 60 C44 26, 108 22, 166 52',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<rect x="13" y="20" width="48" height="50" rx="8" fill="#ffffff" stroke="#316616" stroke-width="2"/>' +
        '<rect x="21" y="31" width="12" height="10" rx="3" fill="#c9eba0" stroke="#316616" stroke-width="1.8"/>' +
        '<rect x="37" y="33.5" width="16" height="5" rx="2.5" fill="#88c456"/>' +
        '<rect x="21" y="48" width="12" height="10" rx="3" fill="#e5f6d1" stroke="#316616" stroke-width="1.8"/>' +
        '<rect x="37" y="50.5" width="14" height="5" rx="2.5" fill="#b7de8e"/>' +
        '<path d="M63 11 C77 11 81 24 75 34 C68 42 54 38 52 26 C52 17 57 11 63 11 Z" fill="#b4e482" stroke="#316616" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M53.5 36 Q63 26 73 16" stroke="#316616" stroke-width="1.8" stroke-linecap="round"/>' +
        '</svg>'
    },
    multiple: {
      blobA: '#f7c1d6',
      blobB: '#fce0eb',
      arcColor: '#cc608c',
      arcPath: 'M-8 66 C48 24, 114 20, 174 34',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<g transform="translate(46 43)">' +
        '<ellipse cx="0" cy="0" rx="28" ry="11.5" transform="rotate(32)" stroke="#922653" stroke-width="2"/>' +
        '<ellipse cx="0" cy="0" rx="28" ry="11.5" transform="rotate(-32)" stroke="#922653" stroke-width="2"/>' +
        '<circle cx="0" cy="0" r="8" fill="#f8bad2" stroke="#922653" stroke-width="2"/>' +
        '<circle cx="0" cy="0" r="3" fill="#922653"/>' +
        '</g>' +
        '<circle cx="22" cy="27" r="6.5" fill="#fde3ed" stroke="#922653" stroke-width="1.9"/>' +
        '<path d="M19.5 27.1l1.8 1.8 3.3-3.4" stroke="#922653" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="70" cy="27" r="6.5" fill="#fde3ed" stroke="#922653" stroke-width="1.9"/>' +
        '<path d="M67.5 27.1l1.8 1.8 3.3-3.4" stroke="#922653" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="46" cy="68" r="6.5" fill="#fde3ed" stroke="#922653" stroke-width="1.9"/>' +
        '<path d="M43.5 68.1l1.8 1.8 3.3-3.4" stroke="#922653" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>'
    },
    mixed: {
      blobA: '#c4cffd',
      blobB: '#dfe5fe',
      arcColor: '#667ce0',
      arcPath: 'M-6 58 C48 22, 112 18, 172 36',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<path d="M49 23 C61 25 67 36 65 48 C63 55 58 60 51 62" stroke="#283d8e" stroke-width="5" stroke-linecap="round"/>' +
        '<g transform="translate(41 34) rotate(-26)">' +
        '<rect x="-6" y="-17" width="12" height="28" rx="3" fill="#c7d2fe" stroke="#283d8e" stroke-width="2"/>' +
        '<rect x="-4" y="-22" width="8" height="5" rx="1.5" fill="#ffffff" stroke="#283d8e" stroke-width="1.8"/>' +
        '<rect x="-4" y="11" width="8" height="5" rx="1.5" fill="#9fb2fb" stroke="#283d8e" stroke-width="1.8"/>' +
        '</g>' +
        '<rect x="24" y="52" width="24" height="4.5" rx="2.2" fill="#9fb2fb" stroke="#283d8e" stroke-width="1.8"/>' +
        '<rect x="20" y="63" width="46" height="8" rx="4" fill="#c7d2fe" stroke="#283d8e" stroke-width="2"/>' +
        '<path d="M72 13v8M68 17h8" stroke="#4f67d6" stroke-width="2" stroke-linecap="round"/>' +
        '</svg>'
    },
    essay: {
      blobA: '#cae8a4',
      blobB: '#e1f4c8',
      arcColor: '#69a63a',
      arcPath: 'M-8 60 C44 26, 108 22, 166 52',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<rect x="15" y="16" width="48" height="54" rx="8" fill="#ffffff" stroke="#316616" stroke-width="2"/>' +
        '<path d="M24 29h26M24 39h22M24 49h18" stroke="#69a63a" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="M64 14 C77 14 81 26 75 35 C68 43 55 39 53 28 C53 19 58 14 64 14 Z" fill="#b4e482" stroke="#316616" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M54.5 37 Q64 28 73 18" stroke="#316616" stroke-width="1.8" stroke-linecap="round"/>' +
        '</svg>'
    },
    other: {
      blobA: '#c6dff2',
      blobB: '#e1effa',
      arcColor: '#568ab8',
      arcPath: 'M-8 60 C46 24, 112 20, 170 38',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<circle cx="46" cy="42" r="24" fill="#e2f2fc" stroke="#1d5b84" stroke-width="2"/>' +
        '<path d="M36 42h20M46 32v20" stroke="#1d5b84" stroke-width="2.2" stroke-linecap="round"/>' +
        '</svg>'
    }
  };

  const prodiCardThemes = {
    single: {
      blobA: '#c4d8ea',
      blobB: '#dfeaf5',
      arcColor: '#5b84ad',
      arcPath: 'M46 -6 C74 36, 134 46, 194 22',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<circle cx="44" cy="44" r="25" fill="#ffffff" stroke="#23486e" stroke-width="2"/>' +
        '<circle cx="44" cy="44" r="17" fill="#dfeaf5" stroke="#23486e" stroke-width="1.8"/>' +
        '<path d="M37 44.5l4.8 4.8 9.5-9.8" stroke="#23486e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M68 16l4-4M73 23h6" stroke="#4b79a8" stroke-width="2" stroke-linecap="round"/>' +
        '</svg>'
    },
    category: {
      blobA: '#efd2b4',
      blobB: '#f9e7d3',
      arcColor: '#c98842',
      arcPath: 'M-8 60 C44 26, 108 22, 166 52',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<rect x="16" y="16" width="56" height="52" rx="8" fill="#ffffff" stroke="#7b4815" stroke-width="2"/>' +
        '<path d="M16 32h56M44 16v52" stroke="#7b4815" stroke-width="1.8"/>' +
        '<rect x="23" y="21" width="14" height="5" rx="2.5" fill="#efb97d"/>' +
        '<rect x="51" y="21" width="14" height="5" rx="2.5" fill="#efb97d"/>' +
        '<circle cx="30" cy="49" r="6" fill="#f8d8b4" stroke="#7b4815" stroke-width="1.8"/>' +
        '<circle cx="58" cy="49" r="6" fill="#f8d8b4" stroke="#7b4815" stroke-width="1.8"/>' +
        '</svg>'
    },
    multiple: {
      blobA: '#d4cce9',
      blobB: '#ebe6f6',
      arcColor: '#7b6aa8',
      arcPath: 'M-8 66 C48 24, 114 20, 174 34',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<polygon points="46,12 72,27 72,57 46,72 20,57 20,27" fill="#ebe6f6" stroke="#453573" stroke-width="2" stroke-linejoin="round"/>' +
        '<circle cx="46" cy="42" r="11" fill="#ffffff" stroke="#453573" stroke-width="2"/>' +
        '<path d="M41.5 42.2l3 3 6-6.2" stroke="#453573" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>'
    },
    mixed: {
      blobA: '#bedfd9',
      blobB: '#d9eee9',
      arcColor: '#4a9b8e',
      arcPath: 'M-6 58 C48 22, 112 18, 172 36',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<g transform="translate(36 44)">' +
        '<path d="M16.4,-3.6 L22,-3.4 L22,3.4 L16.4,3.6 L14.2,9 L18.4,13.6 L13.6,18.4 L9,14.2 L3.6,16.4 L3.4,22 L-3.4,22 L-3.6,16.4 L-9,14.2 L-13.6,18.4 L-18.4,13.6 L-14.2,9 L-16.4,3.6 L-22,3.4 L-22,-3.4 L-16.4,-3.6 L-14.2,-9 L-18.4,-13.6 L-13.6,-18.4 L-9,-14.2 L-3.6,-16.4 L-3.4,-22 L3.4,-22 L3.6,-16.4 L9,-14.2 L13.6,-18.4 L18.4,-13.6 L14.2,-9 Z" fill="#c5e8e1" stroke="#185c52" stroke-width="2" stroke-linejoin="round"/>' +
        '<circle cx="0" cy="0" r="8" fill="#ffffff" stroke="#185c52" stroke-width="2"/>' +
        '</g>' +
        '<g transform="translate(66 36) rotate(32)">' +
        '<rect x="-4" y="-8" width="8" height="32" rx="3.5" fill="#ffffff" stroke="#185c52" stroke-width="2"/>' +
        '<path d="M-7 -15a9 9 0 0 1 14 0v6l-4 3v-6a3 3 0 0 0-6 0v6l-4-3v-6Z" fill="#a8ddd3" stroke="#185c52" stroke-width="1.9" stroke-linejoin="round"/>' +
        '</g>' +
        '</svg>'
    },
    other: {
      blobA: '#d2e1f8',
      blobB: '#e6effc',
      arcColor: '#7f9fd3',
      arcPath: 'M-8 60 C46 24, 112 20, 170 38',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<rect x="18" y="13" width="52" height="58" rx="8" fill="#ffffff" stroke="#2c4b81" stroke-width="2"/>' +
        '<rect x="28" y="25" width="32" height="5" rx="2.5" fill="#92b3ec"/>' +
        '<rect x="28" y="38" width="26" height="5" rx="2.5" fill="#bfd4f7"/>' +
        '<rect x="28" y="51" width="20" height="5" rx="2.5" fill="#bfd4f7"/>' +
        '</svg>'
    }
  };

  const dkvCardThemes = {
    single: {
      blobA: '#f8c8b6',
      blobB: '#fde4da',
      arcColor: '#d97652',
      arcPath: 'M46 -6 C74 36, 134 46, 194 22',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<rect x="16" y="16" width="56" height="50" rx="8" fill="#ffffff" stroke="#8a3319" stroke-width="2"/>' +
        '<circle cx="35" cy="36" r="10" fill="#fbd2c1" stroke="#8a3319" stroke-width="2"/>' +
        '<path d="M51 28h13M51 36h10M24 53h40" stroke="#d97652" stroke-width="2.2" stroke-linecap="round"/>' +
        '</svg>'
    },
    category: {
      blobA: '#f5d29c',
      blobB: '#fce9ca',
      arcColor: '#cc8d2d',
      arcPath: 'M-8 60 C44 26, 108 22, 166 52',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<rect x="15" y="17" width="26" height="22" rx="5" fill="#fde3b8" stroke="#7c4e0e" stroke-width="2"/>' +
        '<rect x="47" y="17" width="28" height="22" rx="5" fill="#ffffff" stroke="#7c4e0e" stroke-width="2"/>' +
        '<rect x="15" y="45" width="26" height="22" rx="5" fill="#ffffff" stroke="#7c4e0e" stroke-width="2"/>' +
        '<rect x="47" y="45" width="28" height="22" rx="5" fill="#f9d49a" stroke="#7c4e0e" stroke-width="2"/>' +
        '</svg>'
    },
    multiple: {
      blobA: '#e0c2f7',
      blobB: '#f0e0fc',
      arcColor: '#965cc9',
      arcPath: 'M-8 66 C48 24, 114 20, 174 34',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<circle cx="38" cy="40" r="18" fill="#e8d0fa" stroke="#53257d" stroke-width="2"/>' +
        '<circle cx="56" cy="44" r="16" fill="#ffffff" fill-opacity="0.82" stroke="#53257d" stroke-width="2"/>' +
        '<path d="M45 36l3 3 6-6" stroke="#53257d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>'
    },
    mixed: {
      blobA: '#f6bfd6',
      blobB: '#fce0ec',
      arcColor: '#cc5d8f',
      arcPath: 'M-6 58 C48 22, 112 18, 172 36',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<path d="M16 62 C26 26, 54 20, 74 32" stroke="#852250" stroke-width="2" stroke-dasharray="4 3" stroke-linecap="round"/>' +
        '<circle cx="16" cy="62" r="4" fill="#ffffff" stroke="#852250" stroke-width="1.9"/>' +
        '<circle cx="74" cy="32" r="4" fill="#ffffff" stroke="#852250" stroke-width="1.9"/>' +
        '<rect x="37" y="21" width="8" height="8" rx="1.5" fill="#f8bdd7" stroke="#852250" stroke-width="1.9"/>' +
        '<g transform="translate(46 47) rotate(-32)">' +
        '<path d="M0 -20 L11 4 L6 16 L-6 16 L-11 4 Z" fill="#ffffff" stroke="#852250" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M0 -20 L0 -3" stroke="#852250" stroke-width="2" stroke-linecap="round"/>' +
        '<circle cx="0" cy="-1" r="3.4" fill="#f6b2d0" stroke="#852250" stroke-width="1.8"/>' +
        '<rect x="-8" y="16" width="16" height="6" rx="2.5" fill="#f6b2d0" stroke="#852250" stroke-width="1.9"/>' +
        '</g>' +
        '<circle cx="70" cy="60" r="8" fill="#fbd1e3" stroke="#852250" stroke-width="1.9"/>' +
        '<circle cx="67" cy="58" r="2" fill="#852250"/>' +
        '<circle cx="73" cy="58" r="2" fill="#cc5d8f"/>' +
        '<circle cx="70" cy="63" r="2" fill="#ffffff" stroke="#852250" stroke-width="1.2"/>' +
        '</svg>'
    },
    other: {
      blobA: '#f6bfd6',
      blobB: '#fce0ec',
      arcColor: '#cc5d8f',
      arcPath: 'M-8 60 C46 24, 112 20, 170 38',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<rect x="18" y="13" width="52" height="58" rx="8" fill="#ffffff" stroke="#852250" stroke-width="2"/>' +
        '<rect x="28" y="25" width="32" height="5" rx="2.5" fill="#f3a6c8"/>' +
        '<rect x="28" y="38" width="26" height="5" rx="2.5" fill="#f9cbe0"/>' +
        '<rect x="28" y="51" width="20" height="5" rx="2.5" fill="#f9cbe0"/>' +
        '</svg>'
    }
  };

  const bahasaCardThemes = {
    single: {
      blobA: '#f7d1a8',
      blobB: '#fde8d0',
      arcColor: '#d48236',
      arcPath: 'M46 -6 C74 36, 134 46, 194 22',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<rect x="16" y="16" width="54" height="52" rx="8" fill="#ffffff" stroke="#854512" stroke-width="2"/>' +
        '<path d="M26 30h34M26 40h28M26 50h20" stroke="#d48236" stroke-width="2.2" stroke-linecap="round"/>' +
        '</svg>'
    },
    category: {
      blobA: '#f4c6a8',
      blobB: '#fce2d0',
      arcColor: '#c96b38',
      arcPath: 'M-8 60 C44 26, 108 22, 166 52',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<rect x="16" y="18" width="56" height="48" rx="8" fill="#ffffff" stroke="#853912" stroke-width="2"/>' +
        '<path d="M16 36h56M44 18v48" stroke="#853912" stroke-width="1.8"/>' +
        '</svg>'
    },
    multiple: {
      blobA: '#f2c2b8',
      blobB: '#fbe0da',
      arcColor: '#c45b4b',
      arcPath: 'M-8 66 C48 24, 114 20, 174 34',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<rect x="18" y="18" width="52" height="48" rx="8" fill="#fce4df" stroke="#7d2b20" stroke-width="2"/>' +
        '<path d="M28 34l4 4 8-8M28 50l4 4 8-8M48 35h14M48 51h12" stroke="#7d2b20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>'
    },
    mixed: {
      blobA: '#f7cfa2',
      blobB: '#fde7cd',
      arcColor: '#d17f2c',
      arcPath: 'M-6 58 C48 22, 112 18, 172 36',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<path d="M14 25c0-3.3 2.7-6 6-6h18c3.3 0 6 2.7 6 6v36c-3-2.1-6.5-3.1-10-3.1H20c-3.3 0-6 1.5-6 3.1V25Z" fill="#ffffff" stroke="#7d410d" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M74 25c0-3.3-2.7-6-6-6H50c-3.3 0-6 2.7-6 6v36c3-2.1 6.5-3.1 10-3.1h14c3.3 0 6 1.5 6 3.1V25Z" fill="#fef0dd" stroke="#7d410d" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M22 31h14M22 39h14M22 47h10" stroke="#d17f2c" stroke-width="2.1" stroke-linecap="round"/>' +
        '<path d="M52 31h14M52 39h11" stroke="#d17f2c" stroke-width="2.1" stroke-linecap="round"/>' +
        '<path d="M54 12h22a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H64l-6 5v-5h-4a5 5 0 0 1-5-5V17a5 5 0 0 1 5-5Z" fill="#fbd7ad" stroke="#7d410d" stroke-width="1.9" stroke-linejoin="round"/>' +
        '<path d="M57 20h15M57 25h10" stroke="#7d410d" stroke-width="1.8" stroke-linecap="round"/>' +
        '</svg>'
    },
    other: {
      blobA: '#f7cfa2',
      blobB: '#fde7cd',
      arcColor: '#d17f2c',
      arcPath: 'M-8 60 C46 24, 112 20, 170 38',
      art: '<svg viewBox="0 0 92 84" fill="none" aria-hidden="true">' +
        '<rect x="18" y="13" width="52" height="58" rx="8" fill="#ffffff" stroke="#7d410d" stroke-width="2"/>' +
        '<rect x="28" y="25" width="32" height="5" rx="2.5" fill="#efb677"/>' +
        '<rect x="28" y="38" width="26" height="5" rx="2.5" fill="#f7d3a8"/>' +
        '<rect x="28" y="51" width="20" height="5" rx="2.5" fill="#f7d3a8"/>' +
        '</svg>'
    }
  };

  function resolveCardTheme(category, programId, format) {
    if (category !== 'prodi') return umumCardThemes[format] || umumCardThemes.other;
    if (programId === 'pgsd') return pgsdCardThemes[format] || pgsdCardThemes.other;
    if (programId === 'ipa') return ipaCardThemes[format] || ipaCardThemes.other;
    if (programId === 'dkv') return dkvCardThemes[format] || dkvCardThemes.other;
    if (programId === 'bahasa-indonesia') return bahasaCardThemes[format] || bahasaCardThemes.other;
    return prodiCardThemes[format] || prodiCardThemes.other;
  }

  function makeCardBackdrop(category, programId, format) {
    const theme = resolveCardTheme(category, programId, format);
    const bg = document.createElement('div');
    bg.className = 'pack-card-bg';
    bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML = '<svg viewBox="0 0 280 220" preserveAspectRatio="none" fill="none">' +
      '<circle cx="42" cy="190" r="68" fill="' + theme.blobA + '" fill-opacity="0.34"/>' +
      '<circle cx="244" cy="36" r="56" fill="' + theme.blobB + '" fill-opacity="0.45"/>' +
      '<path d="' + theme.arcPath + '" stroke="' + theme.arcColor + '" stroke-opacity="0.4" stroke-width="1.35" stroke-dasharray="4 4" stroke-linecap="round"/>' +
      '</svg>';
    return bg;
  }

  function makeCardArt(category, programId, format) {
    const theme = resolveCardTheme(category, programId, format);
    const art = document.createElement('div');
    art.className = 'pack-art';
    art.setAttribute('aria-hidden', 'true');
    art.innerHTML = theme.art;
    return art;
  }

  function packFormat(pack) {
    if (Object.hasOwn(formats, pack.format)) return pack.format;
    const types = new Set(pack.questions.map((question) => {
      if (question.type === 'true_false') return question.statements?.length ? 'category' : 'single';
      return aliases[question.type] || question.type;
    }));
    if (types.size > 1) return 'mixed';
    const [type] = types;
    return Object.hasOwn(formats, type) ? type : 'other';
  }

  function normalize(text) {
    return text.toLocaleLowerCase('id-ID');
  }

  function statusOf(attempt) {
    if (!attempt) return null;
    if (attempt.status === 'completed') return { state: 'complete', label: 'Selesai', action: 'Lihat Hasil' };
    if (attempt.pausedAt != null) return { state: 'paused', label: 'Dijeda', action: 'Lanjutkan' };
    return { state: 'active', label: 'Berlangsung', action: 'Lanjutkan' };
  }

  function create({ home, packs, programs = [], store, engine, button, timeText, start, openDialog, closeDialog }) {
    const el = window.TryoutQuestionView.element;
    const programMap = new Map();
    for (const program of programs) {
      if (program?.id) programMap.set(program.id, program);
    }
    const entries = Array.from(packs.values(), (pack) => {
      const format = packFormat(pack);
      const category = pack.category === 'prodi' || pack.programId ? 'prodi' : 'umum';
      const programId = category === 'prodi' ? (pack.programId || 'umum-prodi') : '';
      if (programId && !programMap.has(programId)) {
        programMap.set(programId, {
          id: programId,
          label: pack.groupLabel || programId,
          fullName: pack.groupLabel || programId,
          subtitle: 'PCK ' + (pack.groupLabel || programId)
        });
      }
      const programName = programMap.get(programId)?.fullName || '';
      return {
        pack,
        format,
        category,
        programId,
        search: normalize([pack.title, pack.description, pack.groupLabel || '', programName, formats[format].label].join(' '))
      };
    });

    const programList = Array.from(programMap.values());
    const sectionsContainer = home.querySelector('.catalog-sections');
    const empty = home.querySelector('.catalog-empty');
    const tracks = home.querySelector('.catalog-tracks');
    const filters = home.querySelector('.catalog-filters');
    const search = home.querySelector('#catalog-search');
    const count = home.querySelector('.catalog-count');
    const trackButtons = new Map();
    const filterButtons = new Map();
    let trackFilter = '';
    let activeProgramId = programList.find((program) => entries.some((entry) => entry.programId === program.id))?.id || programList[0]?.id || '';
    let formatFilter = '';
    let selectedId = '';
    let cardControls = new Map();

    const totalQuestions = entries.reduce((total, { pack }) => total + pack.questions.length, 0);
    home.querySelector('.home-totals').textContent =
      numbers.format(entries.length) + ' paket • ' + numbers.format(totalQuestions) + ' soal';

    const umumTotal = entries.filter((entry) => entry.category === 'umum').length;
    const navItems = [
      { key: '', label: 'Semua', count: entries.length + ' paket', soon: false },
      { key: 'umum', label: 'Umum', count: umumTotal + ' paket', soon: false },
      ...programList.map((program) => {
        const pCount = entries.filter((entry) => entry.programId === program.id).length;
        return {
          key: 'prodi:' + program.id,
          programId: program.id,
          label: program.label,
          count: pCount ? numbers.format(pCount) + ' paket' : 'Segera hadir',
          soon: !pCount
        };
      })
    ];

    function syncTrackButtons() {
      const currentKey = trackFilter === 'prodi' ? ('prodi:' + activeProgramId) : trackFilter;
      for (const [id, item] of trackButtons) {
        item.setAttribute('aria-pressed', String(id === currentKey));
      }
    }

    for (const item of navItems) {
      const control = el('button', 'catalog-track');
      control.type = 'button';
      control.append(
        el('span', 'catalog-track-name', item.label),
        el('span', 'catalog-track-count' + (item.soon ? ' is-soon' : ''), item.count)
      );
      control.addEventListener('click', () => {
        if (item.programId) {
          if (trackFilter === 'prodi' && activeProgramId === item.programId) return;
          trackFilter = 'prodi';
          activeProgramId = item.programId;
        } else {
          if (trackFilter === item.key) return;
          trackFilter = item.key;
        }
        syncTrackButtons();
        clearSelection();
        refresh();
      });
      trackButtons.set(item.key, control);
      tracks.append(control);
    }
    syncTrackButtons();

    const available = new Set(entries.map(({ format }) => format));
    const choices = [['', 'Semua format'], ...Object.entries(formats)
      .filter(([format]) => available.has(format)).map(([format, { label }]) => [format, label])];
    for (const [format, label] of choices) {
      const control = button(label, 'catalog-filter', () => {
        if (formatFilter === format) return;
        formatFilter = format;
        for (const [key, item] of filterButtons) item.setAttribute('aria-pressed', String(key === format));
        clearSelection();
        refresh();
      });
      control.setAttribute('aria-pressed', String(format === formatFilter));
      filterButtons.set(format, control);
      filters.append(control);
    }
    search.addEventListener('input', () => {
      clearSelection();
      refresh();
    });

    function metadata(pack) {
      const meta = el('div', 'pack-meta');
      meta.append(
        el('span', '', numbers.format(pack.questions.length) + ' soal'),
        el('span', '', numbers.format(pack.durationMinutes) + ' menit')
      );
      return meta;
    }

    function markSelection() {
      for (const [id, { card }] of cardControls) {
        card.classList.toggle('is-selected', id === selectedId);
      }
    }

    function clearSelection() {
      if (!selectedId) return;
      selectedId = '';
      markSelection();
    }

    function matchesSearchAndFormat(entry, terms) {
      return (!formatFilter || entry.format === formatFilter) && terms.every((term) => entry.search.includes(term));
    }

    function buildCard({ pack, format, category, programId }) {
      const state = statusOf(store.load(pack));
      const card = el('article', 'pack-card');
      card.dataset.format = format;
      card.dataset.track = category;
      if (programId) card.dataset.program = programId;
      const top = el('div', 'pack-card-top');
      const kindLabel = category === 'prodi'
        ? ('PCK • ' + (programMap.get(programId)?.label || pack.groupLabel || 'Prodi'))
        : 'Pedagogi Umum';
      top.append(el('span', 'pack-kind' + (category === 'prodi' ? ' is-prodi' : ''), kindLabel));
      if (state) {
        const status = el('span', 'pack-status', state.label);
        status.dataset.state = state.state;
        top.append(status);
      }
      const action = state?.action || 'Pilih Paket';
      const control = button(action, 'button button-secondary pack-link', () => openPackDialog(pack), 'right');
      control.setAttribute('aria-label', action + ': ' + pack.title);
      control.setAttribute('aria-haspopup', 'dialog');
      card.append(
        makeCardBackdrop(category, programId, format),
        makeCardArt(category, programId, format),
        top,
        el('h3', 'pack-name', pack.title),
        el('p', 'pack-description', pack.description),
        metadata(pack),
        control
      );
      cardControls.set(pack.id, { card, control });
      return card;
    }

    function buildPackGrid(list) {
      const grid = el('div', 'pack-grid');
      for (const entry of list) grid.append(buildCard(entry));
      return grid;
    }

    function buildUmumSection(terms) {
      const umumEntries = entries.filter((entry) => entry.category === 'umum' && matchesSearchAndFormat(entry, terms));
      if (!umumEntries.length) return { node: null, count: 0 };
      const section = el('section', 'catalog-section catalog-section-umum');
      section.setAttribute('aria-labelledby', 'section-umum-title');
      const head = el('div', 'catalog-section-head');
      const titleGroup = el('div', 'catalog-section-title');
      const heading = el('h3', '', 'Umum');
      heading.id = 'section-umum-title';
      titleGroup.append(heading, el('span', 'catalog-section-pill', 'Pedagogi Umum'));
      const totalQ = umumEntries.reduce((sum, { pack }) => sum + pack.questions.length, 0);
      head.append(
        titleGroup,
        el('span', 'catalog-section-meta', numbers.format(umumEntries.length) + ' paket • ' + numbers.format(totalQ) + ' soal')
      );
      section.append(head, buildPackGrid(umumEntries));
      return { node: section, count: umumEntries.length };
    }

    function buildProdiPlaceholder(program) {
      const card = el('div', 'program-empty-card');
      const badgeRow = el('div', 'program-empty-badges');
      badgeRow.append(
        el('span', 'catalog-section-pill is-prodi', program.subtitle || ('PCK ' + program.label)),
        el('span', 'program-empty-status', 'Segera Hadir')
      );
      const upcoming = el('ul', 'program-empty-list');
      for (const prefix of ['Pilihan Ganda', 'PGK Kategori', 'PGK MCMA', 'Simulasi']) {
        upcoming.append(el('li', '', prefix + ' PCK ' + program.label));
      }
      card.append(
        badgeRow,
        el('h4', 'program-empty-title', 'Paket Soal PCK ' + (program.fullName || program.label)),
        el('p', 'program-empty-text', 'Paket soal PCK khusus program studi ' + (program.fullName || program.label) + ' belum ditambahkan. Paket yang akan tersedia di sini meliputi:'),
        upcoming,
        el('p', 'program-empty-hint', 'Untuk mengaktifkannya, tambahkan paket dengan programId: "' + program.id + '" pada data/questions.js.')
      );
      return card;
    }

    function buildProdiSection(terms) {
      if (!programList.length) return { node: null, count: 0 };
      const section = el('section', 'catalog-section catalog-section-prodi');
      section.setAttribute('aria-labelledby', 'section-prodi-title');
      const head = el('div', 'catalog-section-head');
      const titleGroup = el('div', 'catalog-section-title');
      const heading = el('h3', '', 'Program Studi');
      heading.id = 'section-prodi-title';
      titleGroup.append(heading, el('span', 'catalog-section-pill is-prodi', 'PCK Bidang Studi'));

      const tabs = el('div', 'program-tabs');
      tabs.setAttribute('role', 'group');
      tabs.setAttribute('aria-label', 'Pilih program studi');
      for (const program of programList) {
        const programCount = entries.filter((entry) => entry.programId === program.id).length;
        const tab = el('button', 'program-tab');
        tab.type = 'button';
        tab.setAttribute('aria-pressed', String(program.id === activeProgramId));
        tab.append(
          el('span', 'program-tab-name', program.label),
          el('span', 'program-tab-count' + (programCount ? '' : ' is-soon'),
            programCount ? numbers.format(programCount) + ' paket' : 'Segera hadir')
        );
        tab.addEventListener('click', () => {
          if (activeProgramId === program.id) return;
          activeProgramId = program.id;
          syncTrackButtons();
          clearSelection();
          refresh();
        });
        tabs.append(tab);
      }
      head.append(titleGroup, tabs);

      const activeProgram = programMap.get(activeProgramId) || programList[0];
      const programAll = entries.filter((entry) => entry.programId === activeProgram.id);
      if (!programAll.length) {
        if (terms.length > 0 || formatFilter) return { node: null, count: 0 };
        section.append(head, buildProdiPlaceholder(activeProgram));
        return { node: section, count: 0 };
      }

      const visible = programAll.filter((entry) => matchesSearchAndFormat(entry, terms));
      if (!visible.length) return { node: null, count: 0 };
      section.append(head, buildPackGrid(visible));
      return { node: section, count: visible.length };
    }

    function refresh() {
      const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
      cardControls = new Map();
      const fragment = document.createDocumentFragment();
      let visibleCount = 0;

      if (trackFilter === '' || trackFilter === 'umum') {
        const umum = buildUmumSection(terms);
        if (umum.node) fragment.append(umum.node);
        visibleCount += umum.count;
      }
      if (trackFilter === '' || trackFilter === 'prodi') {
        const prodi = buildProdiSection(terms);
        if (prodi.node) fragment.append(prodi.node);
        visibleCount += prodi.count;
      }

      sectionsContainer.replaceChildren(fragment);
      const hasContent = sectionsContainer.childElementCount > 0;
      empty.hidden = hasContent;
      count.textContent = numbers.format(visibleCount) + ' paket ditampilkan';
      markSelection();
    }

    function openPackDialog(pack, confirmRestart = false) {
      const attempt = store.load(pack);
      const state = statusOf(attempt);
      const format = packFormat(pack);
      const category = pack.category === 'prodi' || pack.programId ? 'prodi' : 'umum';
      selectedId = pack.id;
      markSelection();
      const title = confirmRestart ? 'Mulai ulang paket?' : pack.title;
      openDialog(title, 'pack-dialog is-' + format + (category === 'prodi' ? ' is-prodi' : ''), (parent) => {
        const actions = el('div', 'dialog-actions');
        if (confirmRestart) {
          parent.append(
            el('p', 'dialog-intro', 'Jawaban dan hasil lama untuk ' + pack.title + ' akan diganti dengan sesi baru.'),
            el('p', 'dialog-callout is-warning', 'Progres sebelumnya pada paket ini akan dihapus dan waktu dimulai ulang dari awal.')
          );
          actions.append(
            button('Batal', 'button button-secondary', () => openPackDialog(pack, false)),
            button('Mulai Ulang', 'button button-primary', () => start(pack, true), 'next')
          );
        } else {
          const badgeText = (category === 'prodi' ? (pack.groupLabel || 'PCK Prodi') : 'Pedagogi Umum') + ' • ' + formats[format].label;
          const metaRow = el('div', 'pack-dialog-meta');
          metaRow.append(el('span', 'pack-dialog-badge', badgeText), metadata(pack));
          parent.append(el('p', 'dialog-intro', pack.description), metaRow);
          let status = 'Waktu mulai berjalan setelah kamu menekan Mulai Tryout.';
          let calloutClass = 'dialog-callout is-info';
          if (state?.state === 'complete') {
            status = 'Paket ini sudah selesai. Kamu bisa melihat hasil atau mengulang tryout dari awal.';
          } else if (state) {
            status = (state.state === 'paused' ? 'Tryout sedang dijeda.' : 'Pengerjaan tersimpan.') +
              ' Sisa waktu ' + timeText(engine.remainingSeconds(attempt)) + '.';
            if (state.state === 'paused') calloutClass = 'dialog-callout is-warning';
          }
          parent.append(el('p', calloutClass, status));
          if (!store.persistent) {
            parent.append(el('p', 'local-note', 'Pengerjaan tersedia selama halaman ini terbuka.'));
          }
          actions.append(
            state
              ? button('Mulai Ulang', 'button button-secondary', () => openPackDialog(pack, true))
              : button('Batal', 'button button-secondary', closeDialog)
          );
          const label = state?.state === 'complete' ? 'Lihat Hasil' : state ? 'Lanjutkan Pengerjaan' : 'Mulai Tryout';
          actions.append(button(label, 'button button-primary', () => start(pack), 'next'));
        }
        parent.append(actions);
      });
    }

    return {
      activate() {
        clearSelection();
        refresh();
      },
      clearSelection,
      refresh
    };
  }

  window.TryoutCatalog = { create };
})();