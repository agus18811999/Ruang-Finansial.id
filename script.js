document.addEventListener('DOMContentLoaded', function () {
    // ===== KONFIGURASI API GEMINI =====
    const API_URL = "/api/gemini";
    // ===== CHECK UP FINANSIAL =====
   // ===== CHECK UP FINANSIAL =====
// ===== CHECK UP FINANSIAL =====
async function askGemini(prompt) {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Gagal menghubungi AI.");
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}
function formatNumberWithDots(number) {
    return number.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// 2. Event Listener untuk memformat input secara otomatis saat user mengetik
document.querySelectorAll('.input-nominal').forEach(input => {
    input.addEventListener('input', function(e) {
        // Ambil nilai asli tanpa titik
        let value = this.value.replace(/\./g, '');
        
        // Update tampilan form dengan titik
        this.value = formatNumberWithDots(value);
    });
});
const form = document.getElementById('check-up-form');
const resultContainer = document.getElementById('check-up-result');

const checkUpForm = document.getElementById('check-up-form');
const checkUpResult = document.getElementById('check-up-result');

if (checkUpForm) {
    checkUpForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // PENTING: Bersihkan titik sebelum diubah ke angka agar AI bisa menghitung
        const penghasilan = parseFloat(document.getElementById('penghasilan').value.replace(/\./g, '')) || 0;
        const pengeluaran = parseFloat(document.getElementById('pengeluaran').value.replace(/\./g, '')) || 0;
        const tabungan = parseFloat(document.getElementById('tabungan').value.replace(/\./g, '')) || 0;
        const utang = parseFloat(document.getElementById('utang').value.replace(/\./g, '')) || 0;
        const statusPernikahan = document.getElementById('status-pernikahan').value;
        const pekerjaan = document.getElementById('pekerjaan').value;

    if (isNaN(penghasilan) || isNaN(pengeluaran) || isNaN(tabungan) || isNaN(utang)) {
        resultContainer.innerHTML = '<p style="color: red;">Mohon isi semua data dengan angka yang valid.</p>';
        resultContainer.style.display = 'block';
        return;
    }

    resultContainer.innerHTML = '<p>Analisis sedang diproses oleh AI...</p>';
    resultContainer.style.display = 'block';

    const prompt = `
        Sebagai seorang ahli finansial yang ramah dan suportif untuk generasi muda, berikan analisis dan saran keuangan berdasarkan data berikut:
        - Penghasilan Bulanan: Rp ${penghasilan.toLocaleString('id-ID')}
        - Pengeluaran Bulanan: Rp ${pengeluaran.toLocaleString('id-ID')}
        - Tabungan: Rp ${tabungan.toLocaleString('id-ID')}
        - Utang: Rp ${utang.toLocaleString('id-ID')}
        - Status Pernikahan: ${statusPernikahan}
        - Pekerjaan: ${pekerjaan}

        Berikan jawaban yang mudah dipahami, personal, dan optimis. Jelaskan kondisi keuangan saat ini dan berikan setidaknya 3 saran praktis.
    `;

    const requestData = {
        contents: [{ parts: [{ text: prompt }] }]
    };

    fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
    .then(res => res.json())
    .then(data => {
        if (data.candidates && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            const formattedResponse = marked.parse(aiResponse);

            resultContainer.innerHTML = `<h4>Hasil Analisis AI Ruang Finansial:</h4>`;
            const resultParagraph = document.createElement('p');
            resultContainer.appendChild(resultParagraph);

            typeWriterEffect(resultParagraph, formattedResponse);

        } else {
            resultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat memberikan respons.</p>';
        }
    })
    .catch(err => {
        console.error(err);
        resultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
    });
});
}




// ===== KALKULATOR INVESTASI =====
// ===== KALKULATOR INVESTASI =====
// ===== KALKULATOR INVESTASI (REVISI VARIABEL UNIK & FORMAT NOMINAL) =====

// Menggunakan nama variabel unik: investmentCalcForm & investmentCalcResult
const investmentCalcForm = document.getElementById('investment-form');
const investmentCalcResult = document.getElementById('investment-result');

if (investmentCalcForm) {
    investmentCalcForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // 1. Ambil nilai & Bersihkan titik (.) dari input nominal
        // Pastikan input di HTML sudah memiliki id="modal-investasi"
        const modalInvestasiRaw = document.getElementById('modal-investasi').value;
        const modalInvestasi = parseFloat(modalInvestasiRaw.replace(/\./g, '')) || 0;
        
        const profilRisiko = document.getElementById('profil-risiko').value;
        const tujuanInvestasi = document.getElementById('tujuan-investasi').value;

        // Validasi
        if (modalInvestasi <= 0) {
            investmentCalcResult.innerHTML = '<p style="color: red;">Mohon masukkan modal investasi yang valid.</p>';
            investmentCalcResult.style.display = 'block';
            return;
        }

        // Tampilkan loading
        investmentCalcResult.innerHTML = '<p>AI sedang menganalisis strategi terbaik...</p>';
        investmentCalcResult.style.display = 'block';

        // Prompt untuk AI (Gunakan variabel modalInvestasi yang sudah bersih dari titik)
        const prompt = `
            Sebagai ahli investasi, berikan strategi portofolio untuk:
            - Modal Investasi: Rp ${modalInvestasi.toLocaleString('id-ID')}
            - Profil Risiko: ${profilRisiko}
            - Tujuan Investasi: ${tujuanInvestasi}

            Berikan alokasi persen ke saham, obligasi, emas, reksadana, crypto, dan instrumen investasi lainya yang memungkinkan. Jelaskan alasan dan risiko secara detail, selain itu buatkan planningnya.
        `;

        const requestData = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        // Kirim ke API Gemini
     fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json())
        .then(data => {
            if (data.candidates && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                const formattedResponse = marked.parse(aiResponse);

                investmentCalcResult.innerHTML = `<h4>Hasil Analisis AI Ruang Finansial:</h4>`;
                
                // Ringkasan Modal
                const summaryDiv = document.createElement('div');
                summaryDiv.style.marginBottom = '15px';
                summaryDiv.style.padding = '10px';
                summaryDiv.style.backgroundColor = '#e8f5e9';
                summaryDiv.style.borderRadius = '8px';
                summaryDiv.style.color = '#2e7d32';
                summaryDiv.innerHTML = `<strong>Modal Analisis:</strong> Rp ${modalInvestasi.toLocaleString('id-ID')}`;
                investmentCalcResult.appendChild(summaryDiv);

                const resultParagraph = document.createElement('div'); 
                resultParagraph.innerHTML = formattedResponse; 
                investmentCalcResult.appendChild(resultParagraph);
                
                // typeWriterEffect(resultParagraph, formattedResponse); // Aktifkan jika ingin efek ketik

            } else {
                investmentCalcResult.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat memberikan respons.</p>';
            }
        })
        .catch(err => {
            console.error(err);
            investmentCalcResult.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
        });
    });
}
// ===== KALKULATOR INVESTASI =====
// ===== KALKULATOR INVESTASI (UPDATE FORMAT NOMINAL) =====
// ===== KALKULATOR TABUNGAN (REVISI VARIABEL UNIK & FORMAT) =====

// Menggunakan nama variabel baru agar tidak bentrok dengan kode sebelumnya
const savingsCalcForm = document.getElementById('savings-form');
const savingsCalcResult = document.getElementById('savings-result');

if (savingsCalcForm) {
    savingsCalcForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // 1. Ambil nilai & Bersihkan titik (.) dari input nominal
        // Kita membersihkan titik agar bisa dihitung secara matematika
        const targetDanaRaw = document.getElementById('target-dana').value;
        const targetDana = parseFloat(targetDanaRaw.replace(/\./g, '')) || 0;

        const kondisiSaatIniRaw = document.getElementById('kondisi-saat-ini').value;
        const kondisiSaatIni = parseFloat(kondisiSaatIniRaw.replace(/\./g, '')) || 0;

        // 2. Ambil nilai jangka waktu (type="number", tidak perlu replace)
        const jangkaWaktu = parseFloat(document.getElementById('jangka-waktu').value);
        
        const tujuanTabungan = document.getElementById('tujuan-tabungan').value;

        // Validasi
        if (isNaN(targetDana) || isNaN(jangkaWaktu) || targetDana <= 0 || jangkaWaktu <= 0) {
            savingsCalcResult.innerHTML = '<p style="color: red;">Mohon isi data target dan jangka waktu dengan valid.</p>';
            savingsCalcResult.style.display = 'block';
            return;
        }

        // Hitung Estimasi Tabungan Bulanan (Manual)
        const sisaTarget = targetDana - kondisiSaatIni;
        const tabunganBulanan = sisaTarget > 0 ? (sisaTarget / jangkaWaktu) : 0;

        // Tampilkan Loading
        savingsCalcResult.innerHTML = '<p>AI sedang merancang strategi menabung...</p>';
        savingsCalcResult.style.display = 'block';

        // Prompt AI (Gunakan angka yang sudah bersih)
        const prompt = `
            Sebagai ahli finansial, berikan strategi menabung untuk:
            - Target Dana: Rp ${targetDana.toLocaleString('id-ID')}
            - Jangka Waktu: ${jangkaWaktu} bulan
            - Kondisi Saat Ini: Rp ${kondisiSaatIni.toLocaleString('id-ID')}
            - Tujuan: ${tujuanTabungan}
            - Estimasi Tabungan Per Bulan yang dibutuhkan: Rp ${tabunganBulanan.toLocaleString('id-ID', { maximumFractionDigits: 0 })}

            Berikan tips praktis, instrumen penyimpanan yang cocok (misal: reksadana pasar uang atau tabungan berjangka), dan motivasi agar konsisten menabung.
        `;

        const requestData = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        // Kirim ke API Gemini
      fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json())
        .then(data => {
            if (data.candidates && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                const formattedResponse = marked.parse(aiResponse);

                savingsCalcResult.innerHTML = `<h4>Strategi Tabungan AI Ruang Finansial:</h4>`;
                
                // Menampilkan ringkasan hasil hitungan di atas teks AI
                const summaryDiv = document.createElement('div');
                summaryDiv.style.marginBottom = '15px';
                summaryDiv.style.padding = '15px';
                summaryDiv.style.backgroundColor = '#e0f7fa';
                summaryDiv.style.borderRadius = '10px';
                summaryDiv.style.borderLeft = '5px solid #00bcd4';
                summaryDiv.innerHTML = `<strong>Rekomendasi Nabung:</strong> <br> <span style="font-size: 1.2em; color: #006064;">Rp ${tabunganBulanan.toLocaleString('id-ID', { maximumFractionDigits: 0 })} / bulan</span>`;
                savingsCalcResult.appendChild(summaryDiv);

                const resultParagraph = document.createElement('div');
                resultParagraph.innerHTML = formattedResponse;
                savingsCalcResult.appendChild(resultParagraph);
                
                // Jika Anda menggunakan typeWriterEffect, uncomment baris di bawah:
                // typeWriterEffect(resultParagraph, formattedResponse); 

            } else {
                savingsCalcResult.innerHTML = '<p style="color: red;">AI tidak merespons.</p>';
            }
        })
        .catch(err => {
            console.error(err);
            savingsCalcResult.innerHTML = '<p style="color: red;">Kesalahan koneksi ke AI.</p>';
        });
    });
}


// ===== KALKULATOR FINANSIAL (PINJAMAN) =====
// ===== KALKULATOR PINJAMAN (UPDATE FORMAT NOMINAL) =====
const loanForm = document.getElementById('loan-form');
const loanResultContainer = document.getElementById('loan-result');

if (loanForm) {
    loanForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // 1. Ambil nilai & Bersihkan titik (.) dari input nominal
        const jumlahPinjamanRaw = document.getElementById('jumlah-pinjaman').value;
        const jumlahPinjaman = parseFloat(jumlahPinjamanRaw.replace(/\./g, '')) || 0;

        // 2. Ambil nilai bunga dan jangka waktu (type="number")
        const bungaTahunan = parseFloat(document.getElementById('bunga-tahunan').value);
        const jangkaWaktuPinjaman = parseFloat(document.getElementById('jangka-waktu-pinjaman').value);

        // Validasi input
        if (jumlahPinjaman <= 0 || isNaN(bungaTahunan) || isNaN(jangkaWaktuPinjaman) || jangkaWaktuPinjaman <= 0) {
            loanResultContainer.innerHTML = '<p style="color: red;">Mohon isi semua data dengan angka yang valid.</p>';
            loanResultContainer.style.display = 'block';
            return;
        }

        // Tampilkan pesan loading
        loanResultContainer.innerHTML = '<p>AI sedang menganalisis pinjaman...</p>';
        loanResultContainer.style.display = 'block';

        // Hitung angsuran bulanan (Rumus: PMT sederhana)
        // Bunga per bulan dalam desimal
        const bungaBulanan = (bungaTahunan / 100) / 12;
        let angsuranBulanan;

        if (bungaBulanan > 0) {
            angsuranBulanan = (jumlahPinjaman * bungaBulanan) / (1 - Math.pow(1 + bungaBulanan, -jangkaWaktuPinjaman));
        } else {
            angsuranBulanan = jumlahPinjaman / jangkaWaktuPinjaman;
        }

        const totalPembayaran = angsuranBulanan * jangkaWaktuPinjaman;
        const totalBunga = totalPembayaran - jumlahPinjaman;

        // Persiapkan prompt untuk AI (Gunakan angka bersih)
        const prompt = `
            Sebagai ahli finansial, berikan analisis dan saran untuk pinjaman dengan detail berikut:
            - Jumlah Pinjaman: Rp ${jumlahPinjaman.toLocaleString('id-ID')}
            - Bunga Tahunan: ${bungaTahunan.toLocaleString('id-ID')}%
            - Jangka Waktu: ${jangkaWaktuPinjaman.toLocaleString('id-ID')} bulan
            - Angsuran Bulanan (Hasil Hitung): Rp ${angsuranBulanan.toLocaleString('id-ID', { maximumFractionDigits: 2 })}
            - Total Bunga yang Dibayarkan: Rp ${totalBunga.toLocaleString('id-ID', { maximumFractionDigits: 2 })}
            - Total Pembayaran Akhir: Rp ${totalPembayaran.toLocaleString('id-ID', { maximumFractionDigits: 2 })}

            Jelaskan secara singkat apakah pinjaman ini sehat berdasarkan beban bunga tersebut, dan berikan tips untuk melunasi pinjaman ini lebih cepat atau mengelolanya dengan bijak.
        `;

        const requestData = {
            contents: [{ parts: [{ text: prompt }] }]
        };

   fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json())
        .then(data => {
            if (data.candidates && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                const formattedResponse = marked.parse(aiResponse);

                loanResultContainer.innerHTML = `<h4>Analisis Pinjaman AI Ruang Finansial:</h4>`;
                
                // Tampilkan Ringkasan Angka di atas
                const summaryDiv = document.createElement('div');
                summaryDiv.style.marginBottom = '15px';
                summaryDiv.style.padding = '15px';
                summaryDiv.style.backgroundColor = '#fff3cd'; // Kuning muda untuk warning/info utang
                summaryDiv.style.borderRadius = '10px';
                summaryDiv.style.borderLeft = '5px solid #ffc107';
                summaryDiv.innerHTML = `
                    <p style="margin:0;"><strong>Angsuran per Bulan:</strong> Rp ${angsuranBulanan.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
                    <p style="margin:5px 0 0 0; font-size:0.9em; color:#666;">Total Bunga: Rp ${totalBunga.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
                `;
                loanResultContainer.appendChild(summaryDiv);

                const resultParagraph = document.createElement('div');
                resultParagraph.innerHTML = formattedResponse;
                loanResultContainer.appendChild(resultParagraph);

                // typeWriterEffect(resultParagraph, formattedResponse); // Aktifkan jika pakai efek ketik

            } else {
                loanResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat memberikan respons.</p>';
            }
        })
        .catch(err => {
            console.error(err);
            loanResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
        });
    });
}

// ===== CHAT TANYA AI =====
// ===== CHAT TANYA AI =====
const chatForm = document.getElementById('chat-form');
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

// Fungsi efek mengetik (bisa dipakai HTML, bukan text saja)
function typeWriterEffect(element, htmlText, delay = 15) {
    let i = 0;
    element.innerHTML = '';
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlText;
    const fullText = tempDiv.innerHTML; // biar HTML aman
    const intervalId = setInterval(() => {
        if (i < fullText.length) {
            element.innerHTML = fullText.slice(0, i + 1);
            i++;
            chatBox.scrollTop = chatBox.scrollHeight;
        } else {
            clearInterval(intervalId);
        }
    }, delay);
}

chatForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const userQuestion = userInput.value.trim();
    if (!userQuestion) return;

    // Pesan user
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message';
    userMessageDiv.innerHTML = `<p>${userQuestion}</p>`;
    chatBox.appendChild(userMessageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    userInput.value = '';

    // Pesan loading
    const loadingMessageDiv = document.createElement('div');
    loadingMessageDiv.className = 'message ai-message';
    loadingMessageDiv.innerHTML = '<p>AI sedang mengetik...</p>';
    chatBox.appendChild(loadingMessageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // prompt tanpa tanda kutip di sekitar userQuestion
    const prompt = `
    Kamu adalah seorang ahli finansial yang ramah, bijak, formal, dan mudah dipahami.
    Jawab pertanyaan berikut dengan bahasa santai, formal, dan personal: ${userQuestion}
    
    Tolong gunakan teks tebal  untuk setiap poin penting, gunakan **teks tebal** bila perlu.
    `;

    const requestData = {
        contents: [{ parts: [{ text: prompt }] }]
    };

   fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
    .then(res => res.json())
    .then(data => {
        loadingMessageDiv.remove();
        if (data.candidates && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;

            // Konversi markdown → HTML pakai marked.js
            const htmlResponse = marked.parse(aiResponse);

            // Buat elemen untuk respons AI
            const aiMessageDiv = document.createElement('div');
            aiMessageDiv.className = 'message ai-message';
            const aiMessageP = document.createElement('div');
            aiMessageDiv.appendChild(aiMessageP);
            chatBox.appendChild(aiMessageDiv);

            // Efek mengetik dengan HTML rapi
            typeWriterEffect(aiMessageP, htmlResponse);

        } else {
            chatBox.innerHTML += '<p style="color: red;">AI tidak dapat menjawab.</p>';
        }
    })
    .catch(err => {
        console.error(err);
        loadingMessageDiv.innerHTML = '<p style="color: red;">Kesalahan koneksi ke AI.</p>';
    });
});

// ===== KAMUS FINANSIAL =====
// ===== KAMUS FINANSIAL DENGAN INTEGRASI AI GEMINI =====
const kamusInput = document.getElementById('kamus-input');
const searchButton = document.getElementById('search-button');
const kamusResultContainer = document.getElementById('kamus-result');

searchButton.addEventListener('click', function () {
    const term = kamusInput.value.toLowerCase().trim();
    if (!term) return;

    kamusResultContainer.innerHTML = '<p>AI sedang mencari definisi...</p>';
    kamusResultContainer.style.display = 'block';

    const prompt = `
        Sebagai seorang ahli finansial yang tahu seluruh  hal berkaitan dengan dunia finanasial, jelaskan istilah keuangan "${term}" secara kompleks.
        Berikan definisi yang sesuai, sertakan contoh praktis, dan jelaskan mengapa istilah itu penting.
        Gunakan format Markdown untuk membuat jawaban lebih rapi (misal: tebal untuk kata kunci, poin-poin untuk penjelasan).
    `;

    const requestData = {
        contents: [{ parts: [{ text: prompt }] }]
    };

  fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
    .then(res => res.json())
    .then(data => {
        if (data.candidates && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            const formattedResponse = marked.parse(aiResponse);

            kamusResultContainer.innerHTML = `<h4>Definisi untuk "${term}"</h4>`;
            const resultParagraph = document.createElement('p');
            kamusResultContainer.appendChild(resultParagraph);

            typeWriterEffect(resultParagraph, formattedResponse);
        } else {
            kamusResultContainer.innerHTML = `<p style="color: red;">Maaf, AI tidak dapat menemukan definisi untuk "${term}".</p>`;
        }
    })
    .catch(err => {
        console.error(err);
        kamusResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
    });
});

kamusInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchButton.click();
    }
});
// ===== KALKULATOR TABUNGAN =====
// ===== KALKULATOR TABUNGAN =====
const savingsForm = document.getElementById('savings-form');
const savingsResultContainer = document.getElementById('savings-result');

savingsForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const targetDana = parseFloat(document.getElementById('target-dana').value);
    const jangkaWaktu = parseFloat(document.getElementById('jangka-waktu').value);
    const kondisiSaatIni = parseFloat(document.getElementById('kondisi-saat-ini').value);
    const tujuanTabungan = document.getElementById('tujuan-tabungan').value;

    if (isNaN(targetDana) || isNaN(jangkaWaktu) || targetDana <= 0 || jangkaWaktu <= 0) {
        savingsResultContainer.innerHTML = '<p style="color: red;">Mohon isi data valid.</p>';
        savingsResultContainer.style.display = 'block';
        return;
    }

    const tabunganBulanan = Math.max(0, (targetDana - kondisiSaatIni) / jangkaWaktu);

    savingsResultContainer.innerHTML = '<p>AI sedang merancang strategi menabung...</p>';
    savingsResultContainer.style.display = 'block';

    const prompt = `
        Sebagai ahli finansial, berikan strategi menabung untuk:
        - Target Dana: Rp ${targetDana.toLocaleString('id-ID')}
        - Jangka Waktu: ${jangkaWaktu} bulan
        - Kondisi Saat Ini: Rp ${kondisiSaatIni.toLocaleString('id-ID')}
        - Tujuan: ${tujuanTabungan}
        - Tabungan Per Bulan: Rp ${tabunganBulanan.toLocaleString('id-ID')}

        Berikan tips praktis dan motivasi agar konsisten menabung.
    `;

    const requestData = {
        contents: [{ parts: [{ text: prompt }] }]
    };

   fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
    .then(res => res.json())
    .then(data => {
        if (data.candidates && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            const formattedResponse = marked.parse(aiResponse);
            
            savingsResultContainer.innerHTML = `<h4>Strategi Tabungan AI Ruang Finansial:</h4><p><b>Tabungan Bulanan:</b> Rp ${tabunganBulanan.toLocaleString('id-ID')}</p>`;
            const resultParagraph = document.createElement('p');
            savingsResultContainer.appendChild(resultParagraph);
            
            typeWriterEffect(resultParagraph, formattedResponse);
        } else {
            savingsResultContainer.innerHTML = '<p style="color: red;">AI tidak merespons.</p>';
        }
    })
    .catch(err => {
        console.error(err);
        savingsResultContainer.innerHTML = '<p style="color: red;">Kesalahan koneksi ke AI.</p>';
    });
});
// ===== KALKULATOR KEUANGAN USAHA =====
// ===== KALKULATOR KEUANGAN USAHA (UPDATE FORMAT NOMINAL) =====
const businessForm = document.getElementById('business-form');
const businessResultContainer = document.getElementById('business-result');

if (businessForm) {
    businessForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const namaBisnis = document.getElementById('nama-bisnis').value;
        const jenisBisnis = document.getElementById('jenis-bisnis').value;
        const usiaBisnis = parseFloat(document.getElementById('usia-bisnis').value);
        const lokasiBisnis = document.getElementById('lokasi-bisnis').value;
        const kategoriBisnis = document.getElementById('kategori-bisnis').value;

        // --- AMBIL & BERSIHKAN INPUT NOMINAL (Hapus titik) ---
        const valuasiBisnisRaw = document.getElementById('valuasi-bisnis').value;
        const valuasiBisnis = parseFloat(valuasiBisnisRaw.replace(/\./g, '')) || 0;

        const penjualanBulananRaw = document.getElementById('penjualan-bulanan').value;
        const penjualanBulanan = parseFloat(penjualanBulananRaw.replace(/\./g, '')) || 0;

        const biayaTetapRaw = document.getElementById('biaya-tetap').value;
        const biayaTetap = parseFloat(biayaTetapRaw.replace(/\./g, '')) || 0;

        const biayaVariabelRaw = document.getElementById('biaya-variabel').value;
        const biayaVariabel = parseFloat(biayaVariabelRaw.replace(/\./g, '')) || 0;

        const hargaJualUnitRaw = document.getElementById('harga-jual-unit').value;
        const hargaJualUnit = parseFloat(hargaJualUnitRaw.replace(/\./g, '')) || 0;

        const targetProfitRaw = document.getElementById('target-profit').value;
        const targetProfit = parseFloat(targetProfitRaw.replace(/\./g, '')) || 0;

        // Validasi input
        if (isNaN(penjualanBulanan) || isNaN(biayaTetap) || isNaN(biayaVariabel) || isNaN(hargaJualUnit) || isNaN(targetProfit)) {
            businessResultContainer.innerHTML = '<p style="color: red;">Mohon isi semua data angka dengan valid.</p>';
            businessResultContainer.style.display = 'block';
            return;
        }

        // Tampilkan pesan loading
        businessResultContainer.innerHTML = '<p>AI sedang menganalisis data bisnis...</p>';
        businessResultContainer.style.display = 'block';

        // --- LOGIKA PERHITUNGAN BISNIS ---
        // Hitung profit saat ini
        // Profit = Penjualan - Biaya Tetap - (Biaya Variabel Total)
        // Asumsi Biaya Variabel Total = (Penjualan / Harga Jual) * Biaya Variabel per Unit
        const unitTerjual = hargaJualUnit > 0 ? (penjualanBulanan / hargaJualUnit) : 0;
        const totalBiayaVariabel = unitTerjual * biayaVariabel;
        const profit = penjualanBulanan - biayaTetap - totalBiayaVariabel;
        
        const marginKontribusiPerUnit = hargaJualUnit - biayaVariabel;

        // Hitung Titik Impas (Break-Even Point)
        let unitBEP = 0;
        if (marginKontribusiPerUnit > 0) {
            unitBEP = biayaTetap / marginKontribusiPerUnit;
        }
        const rupiahBEP = unitBEP * hargaJualUnit;

        // Hitung penjualan yang dibutuhkan untuk mencapai target profit
        let targetPenjualanUnit = 0;
        if (marginKontribusiPerUnit > 0) {
            targetPenjualanUnit = (biayaTetap + targetProfit) / marginKontribusiPerUnit;
        }
        
        // Persiapkan prompt untuk AI
        const prompt = `
            Sebagai ahli keuangan bisnis dan strategi UMKM, berikan analisis dan saran berdasarkan data berikut:
            - Nama Bisnis: ${namaBisnis}
            - Jenis Bisnis: ${jenisBisnis}
            - Usia Bisnis: ${usiaBisnis} tahun
            - Valuasi Bisnis: Rp ${valuasiBisnis.toLocaleString('id-ID')}
            - Lokasi Bisnis: ${lokasiBisnis}
            - Kategori Bisnis: ${kategoriBisnis}
            - Penjualan Bulanan: Rp ${penjualanBulanan.toLocaleString('id-ID')}
            - Biaya Tetap Bulanan: Rp ${biayaTetap.toLocaleString('id-ID')}
            - Biaya Variabel per Unit: Rp ${biayaVariabel.toLocaleString('id-ID')}
            - Harga Jual per Unit: Rp ${hargaJualUnit.toLocaleString('id-ID')}
            - Target Profit Bulanan: Rp ${targetProfit.toLocaleString('id-ID')}
            
            **Hasil Perhitungan Sementara:**
            - Profit saat ini: Rp ${profit.toLocaleString('id-ID', { maximumFractionDigits: 2 })}
            - BEP (Unit): ${unitBEP.toLocaleString('id-ID', { maximumFractionDigits: 0 })} unit
            - BEP (Rupiah): Rp ${rupiahBEP.toLocaleString('id-ID', { maximumFractionDigits: 2 })}
            - Target Unit untuk Profit: ${targetPenjualanUnit.toLocaleString('id-ID', { maximumFractionDigits: 0 })} unit

            Jelaskan analisis profitabilitas, titik impas, dan berikan setidaknya 3 saran strategis untuk meningkatkan profit dan mencapai target tersebut.
        `;

        const requestData = {
            contents: [{ parts: [{ text: prompt }] }]
        };

       fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json())
        .then(data => {
            if (data.candidates && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                const formattedResponse = marked.parse(aiResponse);

                businessResultContainer.innerHTML = `<h4>Analisis Bisnis AI Ruang Finansial:</h4>`;
                
                // Ringkasan Angka di atas
                const summaryDiv = document.createElement('div');
                summaryDiv.style.marginBottom = '15px';
                summaryDiv.style.padding = '15px';
                summaryDiv.style.backgroundColor = '#e8f5e9'; // Hijau muda
                summaryDiv.style.borderRadius = '10px';
                summaryDiv.style.borderLeft = '5px solid #4caf50';
                summaryDiv.innerHTML = `
                    <p style="margin:0;"><strong>Profit Saat Ini:</strong> Rp ${profit.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
                    <p style="margin:5px 0 0 0;"><strong>BEP:</strong> Rp ${rupiahBEP.toLocaleString('id-ID', { maximumFractionDigits: 0 })} (${unitBEP.toFixed(0)} unit)</p>
                `;
                businessResultContainer.appendChild(summaryDiv);

                const resultParagraph = document.createElement('div');
                resultParagraph.innerHTML = formattedResponse;
                businessResultContainer.appendChild(resultParagraph);

                // typeWriterEffect(resultParagraph, formattedResponse);

            } else {
                businessResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat memberikan respons.</p>';
            }
        })
        .catch(err => {
            console.error(err);
            businessResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
        });
    });
}
// ===== FITUR LAPORAN KEUANGAN PRIBADI =====
// ===== LAPORAN KEUANGAN PRIBADI (UPDATE FORMAT NOMINAL) =====
const reportForm = document.getElementById('report-form');
const reportResultContainer = document.getElementById('report-result');

if (reportForm) {
    reportForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Ambil data non-nominal
        const namaPelapor = document.getElementById('nama-pelapor').value;
        const profesi = document.getElementById('profesi').value;
        const periodeLaporan = document.getElementById('periode-laporan').value;

        // Ambil data nominal (bersihkan titik)
        const pendapatanAktifRaw = document.getElementById('pendapatan-aktif').value;
        const pendapatanAktif = parseFloat(pendapatanAktifRaw.replace(/\./g, '')) || 0;

        const pendapatanPasifRaw = document.getElementById('pendapatan-pasif').value;
        const pendapatanPasif = parseFloat(pendapatanPasifRaw.replace(/\./g, '')) || 0;

        const pendapatanTambahanRaw = document.getElementById('pendapatan-tambahan').value;
        const pendapatanTambahan = parseFloat(pendapatanTambahanRaw.replace(/\./g, '')) || 0;

        const biayaHidupRaw = document.getElementById('biaya-hidup').value;
        const biayaHidup = parseFloat(biayaHidupRaw.replace(/\./g, '')) || 0;

        const biayaUtangRaw = document.getElementById('biaya-utang').value;
        const biayaUtang = parseFloat(biayaUtangRaw.replace(/\./g, '')) || 0;

        const biayaHiburanRaw = document.getElementById('biaya-hiburan').value;
        const biayaHiburan = parseFloat(biayaHiburanRaw.replace(/\./g, '')) || 0;

        const tabunganInvestasiRaw = document.getElementById('tabungan-investasi').value;
        const tabunganInvestasi = parseFloat(tabunganInvestasiRaw.replace(/\./g, '')) || 0;

        const kasTabunganRaw = document.getElementById('kas-tabungan').value;
        const kasTabungan = parseFloat(kasTabunganRaw.replace(/\./g, '')) || 0;

        const investasiAsetRaw = document.getElementById('investasi-aset').value;
        const investasiAset = parseFloat(investasiAsetRaw.replace(/\./g, '')) || 0;

        const asetTetapRaw = document.getElementById('aset-tetap').value;
        const asetTetap = parseFloat(asetTetapRaw.replace(/\./g, '')) || 0;

        const totalUtangRaw = document.getElementById('total-utang').value;
        const totalUtang = parseFloat(totalUtangRaw.replace(/\./g, '')) || 0;

        // Validasi input
        if (isNaN(pendapatanAktif) || isNaN(biayaHidup) || isNaN(biayaUtang) || isNaN(kasTabungan) || isNaN(totalUtang)) {
            reportResultContainer.innerHTML = '<p style="color: red;">Mohon isi data yang wajib dengan angka valid.</p>';
            reportResultContainer.style.display = 'block';
            return;
        }

        // Tampilkan pesan loading
        reportResultContainer.innerHTML = '<p>AI sedang menganalisis data dan membuat laporan keuangan...</p>';
        reportResultContainer.style.display = 'block';

        // Perhitungan Laporan Laba Rugi (Sederhana)
        const totalPendapatan = pendapatanAktif + pendapatanPasif + pendapatanTambahan;
        const totalPengeluaran = biayaHidup + biayaUtang + biayaHiburan + tabunganInvestasi;
        const labaRugi = totalPendapatan - totalPengeluaran;

        // Perhitungan Neraca
        const totalAset = kasTabungan + investasiAset + asetTetap;
        const totalKekayaanBersih = totalAset - totalUtang;

        // Perhitungan Rasio Keuangan
        const rasioUtangTerhadapPendapatan = (totalUtang / totalPendapatan) * 100;
        const rasioTabunganTerhadapPendapatan = (tabunganInvestasi / totalPendapatan) * 100;
        const rasioLikuiditas = biayaUtang > 0 ? (kasTabungan + investasiAset) / biayaUtang : 0;

        // Prompt untuk AI
        const prompt = `
             Sebagai seorang analis keuangan dan akuntan profesional, tolong buatkan laporan keuangan pribadi untuk ${namaPelapor}, seorang ${profesi}, untuk periode ${periodeLaporan}. Sajikan laporan dalam format tabel menggunakan Markdown.
             
            **LAPORAN KEUANGAN PRIBADI**
            
            **1. Laporan Pendapatan**
            | Item | Jumlah (Rp) |
            | :--- | :--- |
            | Pendapatan Aktif | ${pendapatanAktif.toLocaleString('id-ID')} |
            | Pendapatan Pasif | ${pendapatanPasif.toLocaleString('id-ID')} |
            | Pendapatan Tambahan | ${pendapatanTambahan.toLocaleString('id-ID')} |
            | **Total Pendapatan** | **${totalPendapatan.toLocaleString('id-ID')}** |
            
            **2. Laporan Pengeluaran Konsumtif**
            | Item | Jumlah (Rp) |
            | :--- | :--- |
            | Biaya Hidup | ${biayaHidup.toLocaleString('id-ID')} |
            | Biaya Utang | ${biayaUtang.toLocaleString('id-ID')} |
            | Biaya Hiburan | ${biayaHiburan.toLocaleString('id-ID')} |
            | **Total Pengeluaran Konsumtif** | **${(biayaHidup + biayaUtang + biayaHiburan).toLocaleString('id-ID')}** |

            **3. Alokasi Dana untuk Masa Depan**
            | Item | Jumlah (Rp) |
            | :--- | :--- |
            | Tabungan & Investasi | ${tabunganInvestasi.toLocaleString('id-ID')} |
            | **Total Alokasi** | **${tabunganInvestasi.toLocaleString('id-ID')}** |
            
            **4. Ringkasan Keuangan**
            | Item | Jumlah (Rp) |
            | :--- | :--- |
            | Total Pendapatan | ${totalPendapatan.toLocaleString('id-ID')} |
            | Total Pengeluaran (Konsumtif + Alokasi) | ${(totalPengeluaran).toLocaleString('id-ID')} |
            | **Sisa Dana** | **${labaRugi.toLocaleString('id-ID')}** |
            
            **5. Laporan Neraca**
            | Item | Jumlah (Rp) |
            | :--- | :--- |
            | **Aset** | |
            | Kas & Tabungan | ${kasTabungan.toLocaleString('id-ID')} |
            | Investasi & Aset Lancar | ${investasiAset.toLocaleString('id-ID')} |
            | Aset Tetap | ${asetTetap.toLocaleString('id-ID')} |
            | **Total Aset** | **${totalAset.toLocaleString('id-ID')}** |
            | **Kewajiban & Kekayaan Bersih** | |
            | Total Utang | ${totalUtang.toLocaleString('id-ID')} |
            | **Total Kekayaan Bersih** | **${totalKekayaanBersih.toLocaleString('id-ID')}** |
            
            **6. Rasio Keuangan Utama**
            | Rasio | Hasil | Keterangan |
            | :--- | :--- | :--- |
            | Rasio Utang | ${rasioUtangTerhadapPendapatan.toFixed(2)}% | Utang terhadap pendapatan |
            | Rasio Tabungan | ${rasioTabunganTerhadapPendapatan.toFixed(2)}% | Tabungan terhadap pendapatan |
            | Rasio Likuiditas | ${rasioLikuiditas.toFixed(2)} | Kemampuan membayar utang |
            
            Setelah menyajikan laporan di atas, berikan analisis mendalam dan saran strategis yang personal untuk pengguna, berdasarkan semua data yang diberikan. Secara khusus, jelaskan bahwa angka "laba/rugi" pada laporan ini sebenarnya adalah sisa dana yang dapat dialokasikan kembali. Fokus pada bagaimana pengguna dapat mengoptimalkan "alokasi dana untuk masa depan" dan bukan menganggap sisa dana sebagai masalah.
        `;

        const requestData = {
            contents: [{ parts: [{ text: prompt }] }]
        };

       fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json())
        .then(data => {
            if (data.candidates && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                const formattedResponse = marked.parse(aiResponse);

                reportResultContainer.innerHTML = `<h4>Laporan Keuangan & Analisis AI Ruang Finansial:</h4>`;
                const resultParagraph = document.createElement('div');
                resultParagraph.innerHTML = formattedResponse;
                reportResultContainer.appendChild(resultParagraph);

                // typeWriterEffect(resultParagraph, formattedResponse);

            } else {
                reportResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat membuat laporan. Coba lagi nanti.</p>';
            }
        })
        .catch(err => {
            console.error(err);
            reportResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
        });
    });
}
// ===== KALKULATOR PERENCANAAN KEUANGAN =====
// ===== KALKULATOR PERENCANAAN KEUANGAN (UPDATE FORMAT NOMINAL) =====
const planningForm = document.getElementById('planning-form');
const planningResultContainer = document.getElementById('planning-result');

if (planningForm) {
    planningForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const namaPerencana = document.getElementById('nama-perencana').value;
        const jenisKegiatan = document.getElementById('jenis-kegiatan').value;
        
        // --- AMBIL & BERSIHKAN INPUT NOMINAL ---
        const targetDanaRaw = document.getElementById('target-dana-planning').value;
        const targetDana = parseFloat(targetDanaRaw.replace(/\./g, '')) || 0;

        const danaSaatIniRaw = document.getElementById('dana-saat-ini').value;
        const danaSaatIni = parseFloat(danaSaatIniRaw.replace(/\./g, '')) || 0;

        const penghasilanTambahanRaw = document.getElementById('penghasilan-tambahan').value;
        const penghasilanTambahan = parseFloat(penghasilanTambahanRaw.replace(/\./g, '')) || 0;

        // Input angka biasa
        const jangkaWaktu = parseFloat(document.getElementById('jangka-waktu-planning').value);
        
        const deskripsiKegiatan = document.getElementById('deskripsi-kegiatan').value;

        // Validasi input
        if (!namaPerencana || !jenisKegiatan || targetDana <= 0 || jangkaWaktu <= 0 || !deskripsiKegiatan) {
            planningResultContainer.innerHTML = '<p style="color: red;">Mohon isi semua data wajib dengan valid.</p>';
            planningResultContainer.style.display = 'block';
            return;
        }

        // Tampilkan pesan loading
        planningResultContainer.innerHTML = '<p>AI sedang merancang rencana keuangan Anda...</p>';
        planningResultContainer.style.display = 'block';

        // Hitung dana yang perlu ditabung per bulan (Manual Calculation)
        // Kebutuhan = Target - Dana Saat Ini - (Penghasilan Tambahan * Jangka Waktu)
        // Jika penghasilan tambahan diasumsikan ditabung semua.
        
        const totalKekurangan = targetDana - danaSaatIni;
        const potensiTabunganTambahan = penghasilanTambahan * jangkaWaktu;
        const sisaKekuranganReal = totalKekurangan - potensiTabunganTambahan;
        
        // Tabungan per bulan yang dibutuhkan dari penghasilan utama
        const tabunganBulanan = (sisaKekuranganReal > 0) ? (sisaKekuranganReal / jangkaWaktu) : 0;

        // Prompt untuk AI
        const prompt = `
            Sebagai ahli perencana keuangan, berikan rencana dan saran yang detail untuk tujuan finansial ini:
            - Nama Perencanaan: ${namaPerencana}
            - Jenis Kegiatan: ${jenisKegiatan}
            - Deskripsi Kegiatan: ${deskripsiKegiatan}
            - Target Dana: Rp ${targetDana.toLocaleString('id-ID')}
            - Jangka Waktu: ${jangkaWaktu} bulan
            - Dana Saat Ini: Rp ${danaSaatIni.toLocaleString('id-ID')}
            - Penghasilan Tambahan per Bulan: Rp ${penghasilanTambahan.toLocaleString('id-ID')}
            
            **Hasil Perhitungan Awal:**
            - Kekurangan Dana Total: Rp ${totalKekurangan.toLocaleString('id-ID')}
            - Estimasi Tabungan Per Bulan yang Dibutuhkan (selain penghasilan tambahan): Rp ${tabunganBulanan.toLocaleString('id-ID', { maximumFractionDigits: 0 })}

            Berdasarkan data di atas, berikan analisis yang komprehensif. Buatkan timeline sederhana (milestone), tips menghemat pengeluaran untuk mencapai target, dan rekomendasi instrumen investasi jangka pendek yang aman (jika relevan dengan jangka waktu).
        `;

        const requestData = {
            contents: [{ parts: [{ text: prompt }] }]
        };

      fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json())
        .then(data => {
            if (data.candidates && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                const formattedResponse = marked.parse(aiResponse);

                planningResultContainer.innerHTML = `<h4>Rencana Keuangan AI Ruang Finansial:</h4>`;
                
                // Ringkasan Angka
                const summaryDiv = document.createElement('div');
                summaryDiv.style.marginBottom = '15px';
                summaryDiv.style.padding = '15px';
                summaryDiv.style.backgroundColor = '#e3f2fd'; // Biru muda
                summaryDiv.style.borderRadius = '10px';
                summaryDiv.style.borderLeft = '5px solid #2196f3';
                summaryDiv.innerHTML = `
                    <p style="margin:0;"><strong>Target Nabung Bulanan:</strong> Rp ${tabunganBulanan.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
                    <p style="margin:5px 0 0 0; font-size:0.9em; color:#555;">(Ditambah alokasi penuh dari penghasilan tambahan)</p>
                `;
                planningResultContainer.appendChild(summaryDiv);

                const resultParagraph = document.createElement('div');
                resultParagraph.innerHTML = formattedResponse;
                planningResultContainer.appendChild(resultParagraph);

                // typeWriterEffect(resultParagraph, formattedResponse);

            } else {
                planningResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat memberikan respons.</p>';
            }
        })
        .catch(err => {
            console.error(err);
            planningResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
        });
    });
}
// ===== KONTAK WHATSAPP =====
    // ... (Kode JavaScript lainnya, seperti API Gemini, kalkulator, dll.) ...

    // ===== FITUR KONTAK WHATSAPP =====

// ===== SIMULASI FINANSIAL JANGKA PANJANG =====
// ===== SIMULASI FINANSIAL JANGKA PANJANG (UPDATE FORMAT NOMINAL) =====
const simulationForm = document.getElementById('simulation-form');
const simulationResultContainer = document.getElementById('simulation-result');

if (simulationForm) {
    simulationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // 1. Ambil nilai & Bersihkan titik (.) dari input nominal
        const initialSavingsRaw = document.getElementById('initial-savings').value;
        const initialSavings = parseFloat(initialSavingsRaw.replace(/\./g, '')) || 0;

        const monthlyContributionRaw = document.getElementById('monthly-contribution').value;
        const monthlyContribution = parseFloat(monthlyContributionRaw.replace(/\./g, '')) || 0;

        // 2. Ambil nilai persen dan tahun (type="number")
        const annualReturn = parseFloat(document.getElementById('annual-return').value);
        const inflationRate = parseFloat(document.getElementById('inflation-rate').value);
        const simulationPeriod = parseFloat(document.getElementById('simulation-period').value);

        // Validasi input
        if (isNaN(initialSavings) || isNaN(monthlyContribution) || isNaN(annualReturn) || isNaN(inflationRate) || isNaN(simulationPeriod) || simulationPeriod <= 0) {
            simulationResultContainer.innerHTML = '<p style="color: red;">Mohon isi semua data dengan angka yang valid.</p>';
            simulationResultContainer.style.display = 'block';
            return;
        }

        // Tampilkan loading
        simulationResultContainer.innerHTML = '<p>AI sedang menjalankan simulasi...</p>';
        simulationResultContainer.style.display = 'block';

        // --- PERHITUNGAN FUTURE VALUE (FV) ---
        // Rumus FV dengan kontribusi bulanan (Annuity)
        
        const r = annualReturn / 100;
        const n = 12; // Compounding bulanan
        const t = simulationPeriod;
        
        // 1. FV dari Modal Awal (Compound Interest)
        // FV = P * (1 + r/n)^(n*t)
        const fvInitial = initialSavings * Math.pow((1 + r/n), (n*t));

        // 2. FV dari Kontribusi Bulanan (Future Value of a Series)
        // FV = PMT * [ (1 + r/n)^(n*t) - 1 ] / (r/n)
        let fvContributions = 0;
        if (r !== 0) {
            fvContributions = monthlyContribution * ( (Math.pow((1 + r/n), (n*t)) - 1) / (r/n) );
        } else {
            fvContributions = monthlyContribution * n * t;
        }

        const totalFutureValue = fvInitial + fvContributions;

        // Menghitung Nilai Riil (Disesuaikan Inflasi)
        // PV = FV / (1 + inflation)^t
        // Kita gunakan asumsi inflasi tahunan sederhana untuk mendiskon nilai masa depan
        const realFutureValue = totalFutureValue / Math.pow((1 + inflationRate/100), t);

        // Prompt untuk AI
        const prompt = `
            Sebagai ahli finansial, berikan analisis simulasi keuangan jangka panjang berdasarkan data berikut.
            - Tabungan & Investasi Awal: Rp ${initialSavings.toLocaleString('id-ID')}
            - Kontribusi Bulanan: Rp ${monthlyContribution.toLocaleString('id-ID')}
            - Estimasi Pengembalian Tahunan: ${annualReturn.toFixed(2)}%
            - Estimasi Inflasi Tahunan: ${inflationRate.toFixed(2)}%
            - Jangka Waktu: ${simulationPeriod} tahun
            
            **Hasil Perhitungan Matematis:**
            - Nilai Masa Depan Nominal (Angka Kasar): Rp ${totalFutureValue.toLocaleString('id-ID', { maximumFractionDigits: 2 })}
            - Nilai Masa Depan Riil (Daya Beli setelah Inflasi): Rp ${realFutureValue.toLocaleString('id-ID', { maximumFractionDigits: 2 })}

            Jelaskan hasil simulasi ini dengan bahasa yang mudah dipahami. Apa arti perbedaan antara nilai nominal dan nilai riil bagi pengguna? Berikan saran strategis untuk meningkatkan hasil, misalnya dengan menaikkan kontribusi bulanan atau memilih instrumen investasi yang mengalahkan inflasi.
        `;
        
        const requestData = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json())
        .then(data => {
            if (data.candidates && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                const formattedResponse = marked.parse(aiResponse);

                simulationResultContainer.innerHTML = `<h4>Hasil Simulasi Finansial AI Ruang Finansial:</h4>`;
                
                // Tampilkan Ringkasan Angka
                const summaryDiv = document.createElement('div');
                summaryDiv.style.marginBottom = '15px';
                summaryDiv.style.padding = '15px';
                summaryDiv.style.backgroundColor = '#e8f5e9'; 
                summaryDiv.style.borderRadius = '10px';
                summaryDiv.style.borderLeft = '5px solid #2e7d32';
                summaryDiv.innerHTML = `
                    <p style="margin:0;"><strong>Nilai Masa Depan (Nominal):</strong> Rp ${totalFutureValue.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
                    <p style="margin:5px 0 0 0; font-size:0.9em; color:#555;">Daya Beli Riil (Est.): Rp ${realFutureValue.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
                `;
                simulationResultContainer.appendChild(summaryDiv);

                const resultParagraph = document.createElement('div');
                resultParagraph.innerHTML = formattedResponse;
                simulationResultContainer.appendChild(resultParagraph);

                // typeWriterEffect(resultParagraph, formattedResponse);

            } else {
                simulationResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat menjalankan simulasi. Coba lagi nanti.</p>';
            }
        })
        .catch(err => {
            console.error(err);
            simulationResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
        });
    });
}
// ===== SIMULASI INVESTASI REALISTIS =====
// ===== SIMULASI INVESTASI REALISTIS (UPDATE FORMAT NOMINAL) =====
const investSimulationForm = document.getElementById('invest-simulation-form');
const investSimulationResultContainer = document.getElementById('invest-simulation-result');

if (investSimulationForm) {
    investSimulationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // --- AMBIL & BERSIHKAN INPUT NOMINAL ---
        const initialInvestmentRaw = document.getElementById('initial-investment').value;
        const initialInvestment = parseFloat(initialInvestmentRaw.replace(/\./g, '')) || 0;

        const monthlyInvestRaw = document.getElementById('monthly-invest').value;
        const monthlyInvest = parseFloat(monthlyInvestRaw.replace(/\./g, '')) || 0;

        // Ambil input angka biasa & select
        const investmentPeriod = parseFloat(document.getElementById('investment-period').value);
        const riskProfileInvest = document.getElementById('risk-profile-invest').value;
        const investmentInstrument = document.getElementById('investment-instrument').value;
        const marketCondition = document.getElementById('market-condition').value;
        
        // Perhatikan ID baru untuk menghindari bentrok dengan form lain
        const inflationRate = parseFloat(document.getElementById('invest-inflation-rate').value);
        const taxRate = parseFloat(document.getElementById('invest-tax-rate').value);
        const feesRate = parseFloat(document.getElementById('invest-fees-rate').value);
        
        const liquidityNeed = document.getElementById('liquidity-need').value;

        // Validasi
        if (isNaN(initialInvestment) || isNaN(monthlyInvest) || isNaN(investmentPeriod) || investmentPeriod <= 0) {
            investSimulationResultContainer.innerHTML = '<p style="color: red;">Mohon isi data dengan valid.</p>';
            investSimulationResultContainer.style.display = 'block';
            return;
        }
    
        investSimulationResultContainer.innerHTML = '<p>AI sedang menganalisis simulasi investasi...</p>';
        investSimulationResultContainer.style.display = 'block';

        // --- PERHITUNGAN SIMULASI ---
        // Estimasi Pengembalian Tahunan berdasarkan Instrumen & Pasar
        let estimatedAnnualReturn = 0;
        if (investmentInstrument === 'saham' || investmentInstrument === 'kripto' || investmentInstrument === 'saham-blue-chip') {
            if (marketCondition === 'bullish') estimatedAnnualReturn = 15;
            else if (marketCondition === 'bearish') estimatedAnnualReturn = -10;
            else estimatedAnnualReturn = 5;
        } else if (investmentInstrument.includes('reksadana')) {
            if (marketCondition === 'bullish') estimatedAnnualReturn = 12;
            else if (marketCondition === 'bearish') estimatedAnnualReturn = -2;
            else estimatedAnnualReturn = 4;
        } else if (investmentInstrument === 'emas' || investmentInstrument === 'properti') {
            estimatedAnnualReturn = 8; // Cenderung stabil
        } else if (investmentInstrument === 'deposito' || investmentInstrument === 'obligasi' || investmentInstrument === 'sukuk') {
            estimatedAnnualReturn = 5; // Fixed income
        } else {
            estimatedAnnualReturn = 6; // Default
        }

        // Hitung Future Value (FV)
        const monthlyReturnRate = (estimatedAnnualReturn / 100) / 12;
        const totalMonths = investmentPeriod * 12;

        let futureValueInitial = initialInvestment * Math.pow((1 + monthlyReturnRate), totalMonths);
        let futureValueContributions = 0;
        if (monthlyReturnRate !== 0) {
            futureValueContributions = monthlyInvest * ( (Math.pow((1 + monthlyReturnRate), totalMonths) - 1) / monthlyReturnRate );
        } else {
            futureValueContributions = monthlyInvest * totalMonths;
        }
        
        let totalFutureValueNominal = futureValueInitial + futureValueContributions;

        // Kurangi Pajak & Biaya (Disederhanakan di akhir periode)
        const totalTax = totalFutureValueNominal * (taxRate / 100);
        const totalFees = totalFutureValueNominal * (feesRate / 100);
        const totalFutureValueNet = totalFutureValueNominal - totalTax - totalFees;

        // Nilai Riil (Disesuaikan Inflasi)
        const realFutureValue = totalFutureValueNet / Math.pow((1 + (inflationRate / 100)), investmentPeriod);

        // Prompt AI
        const prompt = `
            Sebagai ahli investasi, berikan analisis mendalam dan simulasi realistis untuk investasi dengan detail berikut:
            - Modal Awal: Rp ${initialInvestment.toLocaleString('id-ID')}
            - Investasi Bulanan: Rp ${monthlyInvest.toLocaleString('id-ID')}
            - Jangka Waktu: ${investmentPeriod} tahun
            - Profil Risiko: ${riskProfileInvest}
            - Instrumen Investasi: ${investmentInstrument}
            - Kondisi Pasar: ${marketCondition}
            - Estimasi Inflasi: ${inflationRate.toFixed(2)}%
            - Estimasi Pajak: ${taxRate.toFixed(2)}%
            - Estimasi Biaya: ${feesRate.toFixed(2)}%
            - Tingkat Likuiditas yang Dibutuhkan: ${liquidityNeed}
            
            **Hasil Perhitungan Simulasi:**
            - Total Nilai Masa Depan (Net setelah pajak/biaya): Rp ${totalFutureValueNet.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
            - Nilai Riil (Daya Beli setelah inflasi): Rp ${realFutureValue.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
            - Estimasi Return Tahunan Instrumen ini: ${estimatedAnnualReturn}% (berdasarkan kondisi ${marketCondition})

            Berdasarkan data di atas, tolong berikan:
            1. **Analisis Potensi**: Apakah hasil ini memuaskan untuk jangka waktu tersebut?
            2. **Faktor Risiko**: Jelaskan risiko spesifik dari ${investmentInstrument} dalam kondisi pasar ${marketCondition}.
            3. **Saran Strategis**: Berikan 3 saran taktis (misal: rebalancing, diversifikasi ke instrumen lain, atau strategi averaging).
        `;

        const requestData = {
            contents: [{ parts: [{ text: prompt }] }]
        };

       fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json())
        .then(data => {
            if (data.candidates && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                const formattedResponse = marked.parse(aiResponse);

                investSimulationResultContainer.innerHTML = `<h4>Simulasi Investasi AI Ruang Finansial:</h4>`;
                
                // Ringkasan Angka
                const summaryDiv = document.createElement('div');
                summaryDiv.style.marginBottom = '15px';
                summaryDiv.style.padding = '15px';
                summaryDiv.style.backgroundColor = '#e8eaf6'; // Indigo muda
                summaryDiv.style.borderRadius = '10px';
                summaryDiv.style.borderLeft = '5px solid #3f51b5';
                summaryDiv.innerHTML = `
                    <p style="margin:0;"><strong>Estimasi Total Akhir:</strong> Rp ${totalFutureValueNet.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
                    <p style="margin:5px 0 0 0; font-size:0.9em; color:#555;">Nilai Riil (Daya Beli): Rp ${realFutureValue.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
                `;
                investSimulationResultContainer.appendChild(summaryDiv);

                const resultDiv = document.createElement('div');
                resultDiv.innerHTML = formattedResponse;
                investSimulationResultContainer.appendChild(resultDiv);
                
                // typeWriterEffect(resultDiv, formattedResponse);

            } else {
                investSimulationResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat menjalankan simulasi. Coba lagi nanti.</p>';
            }
        })
        .catch(err => {
            console.error(err);
            investSimulationResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
        });
    });
}
// ===== SIMULASI KPR RUMAH =====
// ===== SIMULASI KPR RUMAH (UPDATE FORMAT NOMINAL) =====
const kprForm = document.getElementById('kpr-form');
const kprResultContainer = document.getElementById('kpr-result');

if (kprForm) {
    kprForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // --- AMBIL & BERSIHKAN INPUT NOMINAL ---
        const hargaRumahRaw = document.getElementById('harga-rumah').value;
        const hargaRumah = parseFloat(hargaRumahRaw.replace(/\./g, '')) || 0;

        const downPaymentRaw = document.getElementById('down-payment').value;
        const downPayment = parseFloat(downPaymentRaw.replace(/\./g, '')) || 0;

        const penghasilanBulananKprRaw = document.getElementById('penghasilan-bulanan-kpr').value;
        const penghasilanBulananKpr = parseFloat(penghasilanBulananKprRaw.replace(/\./g, '')) || 0;

        // Ambil input angka & teks biasa
        const bungaKpr = parseFloat(document.getElementById('bunga-kpr').value);
        const tenorKpr = parseFloat(document.getElementById('tenor-kpr').value);
        const lokasiRumah = document.getElementById('lokasi-rumah').value;
        const statusKeluarga = document.getElementById('status-keluarga').value;

        // Validasi
        if (hargaRumah <= 0 || downPayment < 0 || isNaN(bungaKpr) || tenorKpr <= 0 || penghasilanBulananKpr <= 0) {
            kprResultContainer.innerHTML = '<p style="color: red;">Mohon isi data dengan valid.</p>';
            kprResultContainer.style.display = 'block';
            return;
        }

        kprResultContainer.innerHTML = '<p>AI sedang menganalisis KPR Anda...</p>';
        kprResultContainer.style.display = 'block';

        // Hitung KPR Manual
        const pokokPinjaman = hargaRumah - downPayment;
        const bungaBulanan = (bungaKpr / 100) / 12;
        const jumlahCicilan = tenorKpr * 12;
        
        let cicilanBulanan = 0;
        if (bungaBulanan > 0) {
            cicilanBulanan = (pokokPinjaman * bungaBulanan) / (1 - Math.pow(1 + bungaBulanan, -jumlahCicilan));
        } else {
            cicilanBulanan = pokokPinjaman / jumlahCicilan;
        }

        const totalPembayaran = cicilanBulanan * jumlahCicilan;
        const totalBunga = totalPembayaran - pokokPinjaman;
        
        const dti = (cicilanBulanan / penghasilanBulananKpr) * 100;

        // Prompt AI
        const prompt = `
            Sebagai ahli finansial dan properti, berikan analisis komprehensif untuk simulasi KPR berikut:
            - Harga Rumah: Rp ${hargaRumah.toLocaleString('id-ID')}
            - Uang Muka: Rp ${downPayment.toLocaleString('id-ID')}
            - Pokok Pinjaman: Rp ${pokokPinjaman.toLocaleString('id-ID')}
            - Suku Bunga: ${bungaKpr}% per tahun
            - Jangka Waktu: ${tenorKpr} tahun
            - Penghasilan Bulanan: Rp ${penghasilanBulananKpr.toLocaleString('id-ID')}
            
            **Hasil Perhitungan:**
            - Cicilan Bulanan: Rp ${cicilanBulanan.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
            - Total Pembayaran Akhir: Rp ${totalPembayaran.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
            - Total Bunga Dibayar: Rp ${totalBunga.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
            - Rasio DTI (Debt-to-Income): ${dti.toLocaleString('id-ID', { maximumFractionDigits: 2 })}% (Cicilan vs Gaji)
            
            Berikan analisis kelayakan: Apakah cicilan ini wajar? Apa risikonya jika suku bunga naik (floating rate)? Berikan saran strategis untuk pelunasan atau pengelolaan cash flow.
        `;

        const requestData = { contents: [{ parts: [{ text: prompt }] }] };
     fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json()).then(data => {
                if (data.candidates && data.candidates[0].content) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    const formattedResponse = marked.parse(aiResponse);
                    
                    kprResultContainer.innerHTML = `<h4>Analisis KPR AI Ruang Finansial:</h4>`;
                    
                    // Ringkasan Angka
                    const summaryDiv = document.createElement('div');
                    summaryDiv.style.marginBottom = '15px';
                    summaryDiv.style.padding = '15px';
                    summaryDiv.style.backgroundColor = '#fff3cd'; 
                    summaryDiv.style.borderRadius = '10px';
                    summaryDiv.style.borderLeft = '5px solid #ffc107';
                    summaryDiv.innerHTML = `
                        <p style="margin:0;"><strong>Cicilan Estimasi:</strong> Rp ${cicilanBulanan.toLocaleString('id-ID', { maximumFractionDigits: 0 })} / bulan</p>
                        <p style="margin:5px 0 0 0; font-size:0.9em;">Rasio Cicilan thd Gaji: <strong>${dti.toFixed(1)}%</strong></p>
                    `;
                    kprResultContainer.appendChild(summaryDiv);

                    const resultDiv = document.createElement('div');
                    resultDiv.innerHTML = formattedResponse;
                    kprResultContainer.appendChild(resultDiv);
                    
                    // typeWriterEffect(resultDiv, formattedResponse);
                } else { kprResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat memberikan respons.</p>'; }
            }).catch(err => {
                console.error(err);
                kprResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
            });
    });
}
// ===== SIMULASI PAJAK =====
// ===== SIMULASI PAJAK =====
// ===== SIMULASI PAJAK (UPDATE FORMAT NOMINAL) =====
const taxForm = document.getElementById('tax-form');
const taxResultContainer = document.getElementById('tax-result');

if (taxForm) {
    taxForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Ambil data non-nominal
        const jenisPajak = document.getElementById('jenis-pajak').value;
        const ptkpStatus = document.getElementById('ptkp').value;
        const statusKepegawaian = document.getElementById('status-kepegawaian').value;
        const jumlahTanggungan = parseInt(document.getElementById('jumlah-tanggungan').value);
        const lokasiNpwp = document.getElementById('lokasi-npwp').value;
        const jenisUsaha = document.getElementById('jenis-usaha').value;

        // --- AMBIL & BERSIHKAN INPUT NOMINAL ---
        const penghasilanTahunanRaw = document.getElementById('penghasilan-tahunan').value;
        const penghasilanTahunan = parseFloat(penghasilanTahunanRaw.replace(/\./g, '')) || 0;

        const biayaPengurangRaw = document.getElementById('biaya-pengurang').value;
        const biayaPengurang = parseFloat(biayaPengurangRaw.replace(/\./g, '')) || 0;

        const penghasilanPasifTahunanRaw = document.getElementById('penghasilan-pasif-tahunan').value;
        const penghasilanPasifTahunan = parseFloat(penghasilanPasifTahunanRaw.replace(/\./g, '')) || 0;

        
        taxResultContainer.innerHTML = '<p>AI sedang menghitung pajak...</p>';
        taxResultContainer.style.display = 'block';

        // Hitung PTKP Manual
        let ptkpAmount = 0;
        switch (ptkpStatus) {
            case 'tk-0': ptkpAmount = 54000000; break;
            case 'k-0': ptkpAmount = 58500000; break;
            case 'k-1': ptkpAmount = 63000000; break;
            case 'k-2': ptkpAmount = 67500000; break;
            case 'k-3': ptkpAmount = 72000000; break;
            default: ptkpAmount = 54000000;
        }

        // Penghasilan Kena Pajak (PKP)
        const penghasilanNetto = (penghasilanTahunan + penghasilanPasifTahunan) - biayaPengurang;
        const pkp = Math.max(0, penghasilanNetto - ptkpAmount);

        // Hitung PPh 21 Progresif (Simulasi Sederhana)
        let pajakTerutang = 0;
        if (jenisPajak === 'pajak-penghasilan-orang-pribadi') {
            let sisaPkp = pkp;
            // Layer 1: 5% up to 60jt
            if (sisaPkp > 0) {
                const layer1 = Math.min(sisaPkp, 60000000);
                pajakTerutang += layer1 * 0.05;
                sisaPkp -= layer1;
            }
            // Layer 2: 15% up to 250jt (total) -> next 190jt
            if (sisaPkp > 0) {
                const layer2 = Math.min(sisaPkp, 190000000);
                pajakTerutang += layer2 * 0.15;
                sisaPkp -= layer2;
            }
            // Layer 3: 25% up to 500jt (total) -> next 250jt
            if (sisaPkp > 0) {
                const layer3 = Math.min(sisaPkp, 250000000);
                pajakTerutang += layer3 * 0.25;
                sisaPkp -= layer3;
            }
            // Layer 4: 30% up to 5M -> next 4.5M
            if (sisaPkp > 0) {
                const layer4 = Math.min(sisaPkp, 4500000000);
                pajakTerutang += layer4 * 0.30;
                sisaPkp -= layer4;
            }
            // Layer 5: 35% above 5M
            if (sisaPkp > 0) {
                pajakTerutang += sisaPkp * 0.35;
            }
        }

        const prompt = `
            Sebagai konsultan pajak Indonesia, berikan simulasi perhitungan dan strategi pajak untuk data berikut:
            - Jenis Pajak: ${jenisPajak}
            - Penghasilan Tahunan Total: Rp ${(penghasilanTahunan + penghasilanPasifTahunan).toLocaleString('id-ID')}
            - Biaya Pengurang: Rp ${biayaPengurang.toLocaleString('id-ID')}
            - PTKP: ${ptkpStatus} (Rp ${ptkpAmount.toLocaleString('id-ID')})
            - Penghasilan Kena Pajak (PKP) Est: Rp ${pkp.toLocaleString('id-ID')}
            - Lokasi KPP: ${lokasiNpwp}
            
            **Hasil Perhitungan PPh 21 (Estimasi):**
            - Pajak Terutang Tahunan: Rp ${pajakTerutang.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
            
            Jelaskan perhitungan ini (tarif progresif). Berikan tips legal (tax planning) untuk menghemat pajak, misalnya memaksimalkan biaya pengurang yang diperbolehkan atau investasi yang pajaknya final.
        `;

        const requestData = { contents: [{ parts: [{ text: prompt }] }] };
       fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json()).then(data => {
                if (data.candidates && data.candidates[0].content) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    const formattedResponse = marked.parse(aiResponse);
                    
                    taxResultContainer.innerHTML = `<h4>Analisis Pajak AI Ruang Finansial:</h4>`;
                    
                    // Ringkasan Angka
                    const summaryDiv = document.createElement('div');
                    summaryDiv.style.marginBottom = '15px';
                    summaryDiv.style.padding = '15px';
                    summaryDiv.style.backgroundColor = '#e0f2f1'; // Teal muda
                    summaryDiv.style.borderRadius = '10px';
                    summaryDiv.style.borderLeft = '5px solid #009688';
                    summaryDiv.innerHTML = `
                        <p style="margin:0;"><strong>Estimasi Pajak Terutang:</strong> Rp ${pajakTerutang.toLocaleString('id-ID', { maximumFractionDigits: 0 })} / tahun</p>
                    `;
                    taxResultContainer.appendChild(summaryDiv);

                    const resultDiv = document.createElement('div');
                    resultDiv.innerHTML = formattedResponse;
                    taxResultContainer.appendChild(resultDiv);
                    
                    // typeWriterEffect(resultDiv, formattedResponse);
                } else { taxResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat memberikan respons.</p>'; }
            }).catch(err => {
                console.error(err);
                taxResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
            });
    });
}
// ===== SIMULASI INFLASI DAN NILAI UANG =====
// ===== SIMULASI INFLASI BARANG (UPDATE FORMAT NOMINAL) =====
const inflationForm = document.getElementById('partner-coding-inflation-form');
const inflationResultContainer = document.getElementById('partner-coding-inflation-result');

if (inflationForm) {
    inflationForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const itemName = document.getElementById('partner-coding-item-name').value;
        
        // --- AMBIL & BERSIHKAN INPUT NOMINAL ---
        const currentCostRaw = document.getElementById('partner-coding-current-cost').value;
        const currentCost = parseFloat(currentCostRaw.replace(/\./g, '')) || 0;

        const inflationRate = parseFloat(document.getElementById('partner-coding-inflation-rate').value);
        const futureYears = parseInt(document.getElementById('partner-coding-future-years').value);
        
        let errorMessage = '';
        if (!itemName) errorMessage = 'Mohon isi Nama Barang.';
        else if (currentCost <= 0) errorMessage = 'Mohon isi Harga Barang dengan valid.';
        else if (isNaN(inflationRate)) errorMessage = 'Mohon isi Inflasi.';
        else if (isNaN(futureYears) || futureYears <= 0) errorMessage = 'Mohon isi Jangka Waktu.';

        if (errorMessage) {
            inflationResultContainer.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
            inflationResultContainer.style.display = 'block';
            return; 
        }

        inflationResultContainer.innerHTML = '<p>AI sedang menganalisis inflasi...</p>';
        inflationResultContainer.style.display = 'block';

        const futureCost = currentCost * Math.pow((1 + inflationRate / 100), futureYears);

        const prompt = `
            Sebagai ahli finansial, jelaskan dampak inflasi terhadap nilai suatu barang dengan data berikut:
            - Nama Barang: ${itemName}
            - Harga Barang Saat Ini: Rp ${currentCost.toLocaleString('id-ID')}
            - Estimasi Inflasi Tahunan: ${inflationRate}%
            - Jangka Waktu: ${futureYears} tahun
            - Perkiraan Harga Barang di Masa Depan: Rp ${futureCost.toLocaleString('id-ID', {maximumFractionDigits: 0})}
            
            Berikan analisis mendalam tentang bagaimana inflasi bekerja menggerus daya beli dan berdampak terhadap nilai barang tersebut. Berikan saran strategis investasi untuk melawan inflasi ini.
        `;

        const requestData = { contents: [{ parts: [{ text: prompt }] }] };
   fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json()).then(data => {
                if (data.candidates && data.candidates[0].content) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    const formattedResponse = marked.parse(aiResponse);
                    
                    inflationResultContainer.innerHTML = `<h4>Simulasi Inflasi AI Ruang Finansial:</h4>`;
                    
                    // Ringkasan
                    const summaryDiv = document.createElement('div');
                    summaryDiv.style.marginBottom = '15px';
                    summaryDiv.style.padding = '15px';
                    summaryDiv.style.backgroundColor = '#ffebee';
                    summaryDiv.style.borderRadius = '10px';
                    summaryDiv.style.borderLeft = '5px solid #f44336';
                    summaryDiv.innerHTML = `
                        <p style="margin:0;"><strong>Harga Masa Depan:</strong> Rp ${futureCost.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
                    `;
                    inflationResultContainer.appendChild(summaryDiv);

                    const resultDiv = document.createElement('div');
                    resultDiv.innerHTML = formattedResponse;
                    inflationResultContainer.appendChild(resultDiv);
                    
                    // typeWriterEffect(resultDiv, formattedResponse);
                } else {
                    inflationResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat memberikan respons.</p>';
                }
            }).catch(err => {
                console.error(err);
                inflationResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
            });
    });
}
// ===== KALKULATOR DANA DARURAT & ASURANSI =====
// ===== KALKULATOR DANA DARURAT (UPDATE FORMAT NOMINAL) =====
const emergencyFundForm = document.getElementById('emergency-fund-form');
const emergencyFundResultContainer = document.getElementById('emergency-fund-result');

if (emergencyFundForm) {
    emergencyFundForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const profesiUser = document.getElementById('profesi-user').value;
        
        // --- AMBIL & BERSIHKAN INPUT NOMINAL ---
        const monthlyIncomeRaw = document.getElementById('monthly-income').value;
        const monthlyIncome = parseFloat(monthlyIncomeRaw.replace(/\./g, '')) || 0;

        const monthlyExpensesRaw = document.getElementById('monthly-expenses').value;
        const monthlyExpenses = parseFloat(monthlyExpensesRaw.replace(/\./g, '')) || 0;

        const numberOfDependents = parseInt(document.getElementById('number-of-dependents').value);
        const jobStability = document.getElementById('job-stability').value;

        if (profesiUser === "" || monthlyIncome <= 0 || monthlyExpenses <= 0 || isNaN(numberOfDependents) || !jobStability) {
            emergencyFundResultContainer.innerHTML = '<p style="color: red;">Mohon isi semua data dengan valid.</p>';
            emergencyFundResultContainer.style.display = 'block';
            return;
        }

        emergencyFundResultContainer.innerHTML = '<p>AI sedang menghitung dana darurat ideal...</p>';
        emergencyFundResultContainer.style.display = 'block';

        let monthsMultiplier = 6;
        if (jobStability === 'tidak-stabil') monthsMultiplier = 12;
        else if (jobStability === 'moderat') monthsMultiplier = 9;
        
        // Jika tanggungan banyak, tambah multiplier
        if (numberOfDependents > 2) monthsMultiplier += 3;

        const idealEmergencyFund = monthlyExpenses * monthsMultiplier;
        const savingsRatio = (monthlyExpenses / monthlyIncome) * 100;

        const prompt = `
            Sebagai ahli perencanaan keuangan, berikan analisis dan rekomendasi dana darurat serta asuransi berdasarkan data berikut:
            - Profesi: ${profesiUser}
            - Penghasilan Bulanan: Rp ${monthlyIncome.toLocaleString('id-ID')}
            - Pengeluaran Bulanan: Rp ${monthlyExpenses.toLocaleString('id-ID')}
            - Jumlah Tanggungan: ${numberOfDependents} orang
            - Stabilitas Pekerjaan: ${jobStability}
            
            **Hasil Perhitungan:**
            - Dana Darurat Ideal: Rp ${idealEmergencyFund.toLocaleString('id-ID')} (${monthsMultiplier} bulan pengeluaran)
            - Rasio Pengeluaran thd Penghasilan: ${savingsRatio.toFixed(1)}%
            
            Jelaskan mengapa dana darurat sebesar itu penting dan berikan saran praktis cara mengumpulkannya (misal: alokasi per bulan). Rekomendasikan juga jenis asuransi (kesehatan, jiwa, properti) yang paling relevan dengan profil ini.
        `;

        const requestData = { contents: [{ parts: [{ text: prompt }] }] };
   fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json()).then(data => {
                if (data.candidates && data.candidates[0].content) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    const formattedResponse = marked.parse(aiResponse);
                    
                    emergencyFundResultContainer.innerHTML = `<h4>Analisis Dana Darurat AI Ruang Finansial:</h4>`;
                    
                    // Ringkasan
                    const summaryDiv = document.createElement('div');
                    summaryDiv.style.marginBottom = '15px';
                    summaryDiv.style.padding = '15px';
                    summaryDiv.style.backgroundColor = '#e3f2fd';
                    summaryDiv.style.borderRadius = '10px';
                    summaryDiv.style.borderLeft = '5px solid #2196f3';
                    summaryDiv.innerHTML = `
                        <p style="margin:0;"><strong>Target Dana Darurat:</strong> Rp ${idealEmergencyFund.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
                        <p style="margin:5px 0 0 0; font-size:0.9em;">Durasi Aman: <strong>${monthsMultiplier} Bulan</strong></p>
                    `;
                    emergencyFundResultContainer.appendChild(summaryDiv);

                    const resultDiv = document.createElement('div');
                    resultDiv.innerHTML = formattedResponse;
                    emergencyFundResultContainer.appendChild(resultDiv);
                    
                    // typeWriterEffect(resultDiv, formattedResponse);
                } else { emergencyFundResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat memberikan respons.</p>'; }
            }).catch(err => {
                console.error(err);
                emergencyFundResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
            });
    });
}
// ===== SIMULASI INFLASI MATA UANG =====
// ===== SIMULASI INFLASI MATA UANG (UPDATE FORMAT NOMINAL) =====
// ===== SIMULASI INFLASI MATA UANG (UPDATE FORMAT NOMINAL) =====
const currencyInflationForm = document.getElementById('currency-inflation-form');
const currencyInflationResultContainer = document.getElementById('currency-inflation-result');

if (currencyInflationForm) {
    currencyInflationForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Data non-nominal
        const baseCurrency = document.getElementById('base-currency').value;
        const targetCurrency = document.getElementById('target-currency').value;
        
        // Nilai Tukar (Exchange Rate) biasanya angka desimal, jadi tetap parseFloat tanpa replace titik ribuan
        const currentExchangeRate = parseFloat(document.getElementById('current-exchange-rate').value);
        
        const baseInflationRate = parseFloat(document.getElementById('base-inflation-rate').value);
        const targetInflationRate = parseFloat(document.getElementById('target-inflation-rate').value);
        const futureYears = parseInt(document.getElementById('future-years-currency').value);

        if (isNaN(currentExchangeRate) || isNaN(baseInflationRate) || isNaN(targetInflationRate) || isNaN(futureYears) || futureYears <= 0) {
            currencyInflationResultContainer.innerHTML = '<p style="color: red;">Mohon isi semua data dengan angka yang valid.</p>';
            currencyInflationResultContainer.style.display = 'block';
            return;
        }

        currencyInflationResultContainer.innerHTML = '<p>AI sedang menganalisis inflasi mata uang...</p>';
        currencyInflationResultContainer.style.display = 'block';

        // Rumus Relative PPP (Purchasing Power Parity) sederhana
        const futureExchangeRate = currentExchangeRate * Math.pow((1 + baseInflationRate / 100) / (1 + targetInflationRate / 100), futureYears);

        const prompt = `
            Sebagai ahli finansial dan ekonomi, berikan analisis simulasi inflasi mata uang berdasarkan data berikut:
            - Mata Uang Dasar: ${baseCurrency}
            - Mata Uang Tujuan: ${targetCurrency}
            - Nilai Tukar Saat Ini: 1 ${targetCurrency} = ${currentExchangeRate.toLocaleString('id-ID')} ${baseCurrency}
            - Inflasi Mata Uang Dasar: ${baseInflationRate}%
            - Inflasi Mata Uang Tujuan: ${targetInflationRate}%
            - Jangka Waktu: ${futureYears} tahun
            
            **Hasil Perhitungan:**
            - Perkiraan Nilai Tukar di Masa Depan: 1 ${targetCurrency} = ${futureExchangeRate.toLocaleString('id-ID', {maximumFractionDigits: 2})} ${baseCurrency}
            
            Berikan analisis mendalam tentang bagaimana inflasi relatif mempengaruhi nilai tukar. Jelaskan implikasinya bagi investasi dan daya beli pengguna yang menggunakan mata uang dasar.
        `;

        const requestData = { contents: [{ parts: [{ text: prompt }] }] };
     fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json()).then(data => {
                if (data.candidates && data.candidates[0].content) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    const formattedResponse = marked.parse(aiResponse);
                    
                    currencyInflationResultContainer.innerHTML = `<h4>Simulasi Inflasi Mata Uang AI Ruang Finansial:</h4>`;
                    
                    // Ringkasan
                    const summaryDiv = document.createElement('div');
                    summaryDiv.style.marginBottom = '15px';
                    summaryDiv.style.padding = '15px';
                    summaryDiv.style.backgroundColor = '#fff3e0';
                    summaryDiv.style.borderRadius = '10px';
                    summaryDiv.style.borderLeft = '5px solid #ff9800';
                    summaryDiv.innerHTML = `
                        <p style="margin:0;"><strong>Kurs Masa Depan:</strong> 1 ${targetCurrency} = ${futureExchangeRate.toLocaleString('id-ID', {maximumFractionDigits: 2})} ${baseCurrency}</p>
                    `;
                    currencyInflationResultContainer.appendChild(summaryDiv);

                    const resultDiv = document.createElement('div');
                    resultDiv.innerHTML = formattedResponse;
                    currencyInflationResultContainer.appendChild(resultDiv);
                    
                    // typeWriterEffect(resultDiv, formattedResponse);

                } else { currencyInflationResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat memberikan respons.</p>'; }
            }).catch(err => {
                console.error(err);
                currencyInflationResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
            });
    });
}// ===== ANALISIS BIAYA PERNIKAHAN & RUMAH TANGGA (UPDATE FORMAT NOMINAL) =====
const weddingForm = document.getElementById('wedding-form');
const weddingResultContainer = document.getElementById('wedding-result');

if (weddingForm) {
    weddingForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const weddingLocation = document.getElementById('wedding-location').value;
        const weddingScale = document.getElementById('wedding-scale').value;
        
        // --- AMBIL & BERSIHKAN INPUT NOMINAL ---
        const weddingBudgetRaw = document.getElementById('wedding-budget').value;
        const weddingBudget = parseFloat(weddingBudgetRaw.replace(/\./g, '')) || 0;

        const monthlyIncomeCoupleRaw = document.getElementById('monthly-income-couple').value;
        const monthlyIncomeCouple = parseFloat(monthlyIncomeCoupleRaw.replace(/\./g, '')) || 0;

        const housingCostRaw = document.getElementById('housing-cost').value;
        const housingCost = parseFloat(housingCostRaw.replace(/\./g, '')) || 0;

        const utilityCostRaw = document.getElementById('utility-cost').value;
        const utilityCost = parseFloat(utilityCostRaw.replace(/\./g, '')) || 0;

        const foodCostRaw = document.getElementById('food-cost').value;
        const foodCost = parseFloat(foodCostRaw.replace(/\./g, '')) || 0;

        const transportationCostRaw = document.getElementById('transportation-cost').value;
        const transportationCost = parseFloat(transportationCostRaw.replace(/\./g, '')) || 0;

        const debtCostRaw = document.getElementById('debt-cost').value;
        const debtCost = parseFloat(debtCostRaw.replace(/\./g, '')) || 0;

        const savingsTargetRaw = document.getElementById('savings-target').value;
        const savingsTarget = parseFloat(savingsTargetRaw.replace(/\./g, '')) || 0;

        // Validasi dasar
        if (isNaN(weddingBudget) || isNaN(monthlyIncomeCouple) || isNaN(housingCost) || isNaN(utilityCost) || isNaN(foodCost) || isNaN(transportationCost) || isNaN(debtCost) || isNaN(savingsTarget)) {
            weddingResultContainer.innerHTML = '<p style="color: red;">Mohon isi semua data dengan angka yang valid.</p>';
            weddingResultContainer.style.display = 'block';
            return;
        }

        weddingResultContainer.innerHTML = '<p>AI sedang menganalisis rencana keuangan Anda...</p>';
        weddingResultContainer.style.display = 'block';
        
        const totalMonthlyExpenses = housingCost + utilityCost + foodCost + transportationCost + debtCost + savingsTarget;
        const remainingIncome = monthlyIncomeCouple - totalMonthlyExpenses;

        const prompt = `
            Sebagai ahli perencanaan keuangan pernikahan dan rumah tangga, berikan analisis komprehensif untuk data berikut:
            
            **Perencanaan Pernikahan:**
            - Lokasi: ${weddingLocation}
            - Skala Acara: ${weddingScale}
            - Anggaran: Rp ${weddingBudget.toLocaleString('id-ID')}
            
            **Perencanaan Rumah Tangga (Bulanan):**
            - Penghasilan Gabungan: Rp ${monthlyIncomeCouple.toLocaleString('id-ID')}
            - Biaya Tempat Tinggal: Rp ${housingCost.toLocaleString('id-ID')}
            - Biaya Utilitas: Rp ${utilityCost.toLocaleString('id-ID')}
            - Biaya Makanan: Rp ${foodCost.toLocaleString('id-ID')}
            - Biaya Transportasi: Rp ${transportationCost.toLocaleString('id-ID')}
            - Cicilan Utang Lain: Rp ${debtCost.toLocaleString('id-ID')}
            - Target Tabungan: Rp ${savingsTarget.toLocaleString('id-ID')}
            
            **Hasil Perhitungan Sementara:**
            - Total Pengeluaran Bulanan: Rp ${totalMonthlyExpenses.toLocaleString('id-ID')}
            - Sisa Penghasilan (Surplus/Defisit): Rp ${remainingIncome.toLocaleString('id-ID')}
            
            Berdasarkan data di atas, berikan analisis mendalam. Untuk pernikahan, apakah anggaran realistis sesuai skala dan lokasi? Untuk rumah tangga, apakah anggaran bulanan seimbang? Berikan saran terperinci tentang cara mengelola pengeluaran bersama, tips untuk mencapai target tabungan, dan peringatan tentang utang.
        `;

        const requestData = { contents: [{ parts: [{ text: prompt }] }] };
  fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json()).then(data => {
                if (data.candidates && data.candidates[0].content) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    const formattedResponse = marked.parse(aiResponse);
                    
                    weddingResultContainer.innerHTML = `<h4>Analisis Perencanaan Keuangan AI Ruang Finansial:</h4>`;
                    
                    // Ringkasan
                    const summaryDiv = document.createElement('div');
                    summaryDiv.style.marginBottom = '15px';
                    summaryDiv.style.padding = '15px';
                    summaryDiv.style.backgroundColor = remainingIncome >= 0 ? '#e8f5e9' : '#ffebee';
                    summaryDiv.style.borderRadius = '10px';
                    summaryDiv.style.borderLeft = remainingIncome >= 0 ? '5px solid #4caf50' : '5px solid #f44336';
                    summaryDiv.innerHTML = `
                        <p style="margin:0;"><strong>Sisa Penghasilan Bulanan:</strong> Rp ${remainingIncome.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</p>
                        <p style="margin:5px 0 0 0; font-size:0.9em;">Status: <strong>${remainingIncome >= 0 ? 'Surplus (Sehat)' : 'Defisit (Perlu Evaluasi)'}</strong></p>
                    `;
                    weddingResultContainer.appendChild(summaryDiv);

                    const resultDiv = document.createElement('div');
                    resultDiv.innerHTML = formattedResponse;
                    weddingResultContainer.appendChild(resultDiv);
                    
                    // typeWriterEffect(resultDiv, formattedResponse);

                } else { weddingResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat memberikan respons.</p>'; }
            }).catch(err => {
                console.error(err);
                weddingResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
            });
    });
}
// ===== FUNGSI SEARCH BAR DI HEADER =====
// ===== LIVE SEARCH FUNCTIONALITY =====
    
    // 1. Daftar Database Fitur (Nama & ID Section HTML)
    // Pastikan ID ini sama persis dengan <section id="..."> di HTML Anda
    const featuresDB = [
        { name: "Laporan Arus Kas (Cash Flow)", id: "cash-flow-generator" },
        { name: "Laporan HPP (COGS)", id: "cogs-report-generator" },
        { name: "Perubahan Modal (Equity)", id: "equity-statement-generator" },
        { name: "Cost of Revenue (COR)", id: "cor-analysis-generator" },
        { name: "Beban Operasional (OPEX)", id: "opex-breakdown-generator" },
        { name: "Margin Kontribusi (CM)", id: "cm-report-generator" },
        { name: "Analisis CapEx & Depresiasi", id: "capex-feasibility-generator" },
        { name: "Laporan Laba Rugi", id: "income-statement-generator" }, // Sesuaikan ID
        { name: "Neraca Keuangan", id: "balance-sheet-generator" }, // Sesuaikan ID
        { name: "Rasio Profitabilitas", id: "profitability-calculator" },
        { name: "Rasio Likuiditas", id: "liquidity-calculator" },
        { name: "Rasio Solvabilitas", id: "solvency-calculator" },
        { name: "Kalkulator Investasi", id: "investment-calculator" },
        { name: "Valuasi Saham & Obligasi", id: "stock-bond-valuation" },
        { name: "Manajemen Risiko", id: "risk-management" },
        { name: "Biaya Modal (WACC)", id: "cost-capital" },
        { name: "Analisis Strategis", id: "strategic-analysis" },
        { name: "Keputusan Operasional", id: "operational-decision" },
        { name: "Financial Check Up", id: "financial-check-u" },
       
    { name: "Kalkulator Tabungan & Masa Depan", id: "savings-calculator" },
    { name: "Kalkulator Keuangan Terpadu", id: "financial-calculator" },
    { name: "Kalkulator Keuangan Bisnis", id: "business-financial-calculator" },
    { name: "Pusat Laporan Keuangan", id: "financial-report" },
    { name: "Perencanaan Keuangan Strategis", id: "financial-planning-calculator" },
    { name: "Simulasi Proyeksi Keuangan", id: "financial-simulation-calculator" },
    { name: "Simulasi Investasi Multi-Aset", id: "investment-simulation" },
    { name: "Kalkulator & Simulasi KPR", id: "kpr-simulation" },
    { name: "Simulasi Estimasi Pajak", id: "tax-simulation" },
    { name: "Simulasi Rekan Pemrograman (Coding)", id: "partner-coding-simulation-section" },
    { name: "Kalkulator Dana Darurat", id: "emergency-fund-calculator" },
    { name: "Simulasi Inflasi & Mata Uang", id: "currency-inflation-simulation" },
    { name: "Analisis Anggaran Pernikahan", id: "wedding-budget-analysis" },
    { name: "Tanya AI Finansial", id: "tanya-ai" },
    { name: "Konsultan Finansial Pribadi", id: "konsultan-finansial-section" },
    { name: "Perencana Anggaran Harian", id: "daily-budget-planner" },
    { name: "Kalkulator Jejak Karbon", id: "carbon-calculator" },
    { name: "Kalkulator Keuangan Hijau (Eco-Finance)", id: "green-financial-calculator" },
    { name: "Kalkulator Bisnis Berkelanjutan", id: "green-business-calculator" },
    { name: "Generator Strategi Keuangan", id: "create-your-strategy-generator" },
    { name: "Generator Model Bisnis", id: "create-your-business-generator" },
    { name: "Solusi Problematika Bisnis", id: "solve-your-business-generator" },
    { name: "Laporan Keberlanjutan (Sustainability)", id: "sustainability-report-generator" },
    { name: "Optimasi Portofolio Investasi", id: "portfolio-optimal-generator" },
    { name: "Laporan Keuangan Individu", id: "ind-report-section" },
    { name: "Generator Laporan Instan", id: "instant-report-generator" },
    { name: "Manajemen Anggaran UMKM", id: "umkm-budgeting" }







    ];

    const searchInput = document.getElementById('feature-search-input');
    const searchDropdown = document.getElementById('search-results-dropdown');

    if (searchInput && searchDropdown) {
        
        // Event Listener: Mengetik (Input)
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();
            
            // Kosongkan dropdown dulu
            searchDropdown.innerHTML = '';
            
            // Jika input kosong, sembunyikan dropdown
            if (query.length === 0) {
                searchDropdown.style.display = 'none';
                return;
            }

            // Filter Fitur
            const matches = featuresDB.filter(feature => {
                // Mencocokkan apakah nama fitur mengandung huruf yang diketik
                return feature.name.toLowerCase().includes(query);
            });

            // Tampilkan Hasil
            if (matches.length > 0) {
                searchDropdown.style.display = 'block';
                
                matches.forEach(feature => {
                    const div = document.createElement('div');
                    div.className = 'search-item';
                    div.innerHTML = `<i class="fas fa-chevron-right"></i> ${feature.name}`;
                    
                    // Aksi Klik
                    div.addEventListener('click', () => {
                        // 1. Scroll ke section
                        const targetSection = document.getElementById(feature.id);
                        if (targetSection) {
                            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            
                            // (Opsional) Beri efek highlight sejenak
                            targetSection.style.transition = "background 0.5s";
                            targetSection.style.backgroundColor = "rgba(99, 102, 241, 0.1)";
                            setTimeout(() => { targetSection.style.backgroundColor = "transparent"; }, 1000);
                        }
                        
                        // 2. Bersihkan search bar
                        searchInput.value = '';
                        searchDropdown.style.display = 'none';
                    });
                    
                    searchDropdown.appendChild(div);
                });
            } else {
                // Jika tidak ada hasil
                searchDropdown.style.display = 'block';
                searchDropdown.innerHTML = '<div class="search-item" style="color:#999; cursor:default;">Fitur tidak ditemukan</div>';
            }
        });

        // Event Listener: Klik di luar (untuk menutup dropdown)
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                searchDropdown.style.display = 'none';
            }
        });
    }
// Fungsi untuk memformat angka dengan titik ribuan
    
    // --- DATABASE FITUR ---
   
    
    // --- CONTACT FORM TO WHATSAPP ---
    const contactForm = document.getElementById('contact-lux-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // 1. Ambil Data
            const name = document.getElementById('wa-name').value;
            const topic = document.getElementById('wa-topic').value;
            const message = document.getElementById('wa-message').value;

            // 2. Nomor WhatsApp Admin (Tanpa 0 atau +)
            const phoneNumber = "6288985454681"; 

            // 3. Format Pesan (Dengan Line Break %0a)
            const formattedMessage = 
                `Halo Admin Ruang Finansial,` + 
                `%0a%0aPerkenalkan saya: *${name}*` +
                `%0aTopik: *${topic}*` +
                `%0a%0aIsi Pesan:` +
                `%0a${message}` +
                `%0a%0aMohon informasinya. Terima kasih.`;

            // 4. Redirect ke API WhatsApp
            const waURL = `https://wa.me/${phoneNumber}?text=${formattedMessage}`;
            
            // Buka di tab baru
            window.open(waURL, '_blank');
        });
    }



    // --- 1. SEARCH LOGIC (UNIVERSAL UNTUK DESKTOP & MOBILE) ---
    // Kita pakai Class selector agar menangkap kedua input (di navbar & di sidebar)
    const searchInputs = document.querySelectorAll('.search-input-global');

    searchInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();
            
            // Cari dropdown terdekat dari input ini (sibling)
            const wrapper = this.closest('.search-wrapper-desktop') || this.closest('.search-wrapper-mobile');
            const dropdown = wrapper.querySelector('.search-results-dropdown');

            dropdown.innerHTML = ''; // Reset

            if (query.length === 0) {
                dropdown.style.display = 'none';
                return;
            }

            // Filter
            const matches = featuresDB.filter(f => f.name.toLowerCase().includes(query));

            // Tampilkan
            dropdown.style.display = 'block';

            if (matches.length > 0) {
                matches.forEach(feature => {
                    const div = document.createElement('div');
                    div.className = 'search-item';
                    div.innerHTML = `<i class="fas fa-chevron-right" style="font-size:0.7rem;"></i> ${feature.name}`;
                    
                    div.addEventListener('click', () => {
                        const target = document.getElementById(feature.id);
                        if (target) {
                            // Scroll ke target
                            const headerOffset = 80;
                            const elementPosition = target.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                        }
                        
                        // Tutup sidebar jika di mobile
                        const sidebar = document.getElementById('mobile-sidebar');
                        if(sidebar) sidebar.classList.remove('active');

                        // Bersihkan search
                        dropdown.style.display = 'none';
                        input.value = '';
                    });
                    
                    dropdown.appendChild(div);
                });
            } else {
                dropdown.innerHTML = '<div class="search-item" style="cursor:default; color:#999;">Fitur tidak ditemukan</div>';
            }
        });

        // Tutup dropdown jika klik luar
        document.addEventListener('click', (e) => {
            const wrapper = input.closest('.search-wrapper-desktop') || input.closest('.search-wrapper-mobile');
            const dropdown = wrapper.querySelector('.search-results-dropdown');
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    });

    // --- 2. SIDEBAR TOGGLE LOGIC ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('mobile-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');

    if(mobileBtn && sidebar) {
        // Buka Sidebar
        mobileBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
        });

        // Tutup Sidebar (Tombol X)
        if(closeSidebarBtn) {
            closeSidebarBtn.addEventListener('click', () => {
                sidebar.classList.remove('active');
            });
        }

        // Tutup Sidebar (Klik Overlay Gelap)
        sidebar.addEventListener('click', (e) => {
            if(e.target === sidebar) {
                sidebar.classList.remove('active');
            }
        });
    }

    // --- 3. SCROLL EFFECT NAVBAR ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

// ===== RANCANGAN BIAYA AKTIVITAS HARIAN =====
// ===== RANCANGAN BIAYA AKTIVITAS HARIAN (UPDATE FORMAT NOMINAL & DINAMIS) =====
const dailyActivityForm = document.getElementById('daily-activity-form');
const dailyBudgetResultContainer = document.getElementById('daily-budget-result');
const addActivityBtn = document.getElementById('add-activity-btn');
const activityListContainer = document.getElementById('activity-list-container');
let activityCount = 1;

// Fungsi helper untuk menambahkan event listener ke input dinamis
function attachNominalFormatter(inputElement) {
    inputElement.addEventListener('input', function(e) {
        let value = this.value.replace(/\./g, '');
        this.value = formatNumberWithDots(value);
    });
}

if (addActivityBtn) {
    addActivityBtn.addEventListener('click', () => {
        activityCount++;
        const newActivityItem = document.createElement('div');
        newActivityItem.classList.add('activity-item');
        newActivityItem.innerHTML = `
            <div class="form-group">
                <label for="aktivitas-${activityCount}">Nama Aktivitas</label>
                <input type="text" id="aktivitas-${activityCount}" name="aktivitas-${activityCount}" placeholder="Contoh: Makan Siang" required>
            </div>
            <div class="form-group">
                <label for="biaya-${activityCount}">Estimasi Biaya (Rp)</label>
                <input type="text" id="biaya-${activityCount}" name="biaya-${activityCount}" class="input-nominal" placeholder="Contoh: 25.000" required>
            </div>
            <div class="form-group">
                <label for="kategori-${activityCount}">Kategori Pengeluaran</label>
                <select id="kategori-${activityCount}" name="kategori-${activityCount}" required>
                    <option value="">Pilih Kategori</option>
                    <option value="transportasi">Transportasi</option>
                    <option value="makan">Makan</option>
                    <option value="hiburan">Hiburan</option>
                    <option value="belanja">Belanja Kebutuhan</option>
                    <option value="lain-lain">Lain-lain</option>
                </select>
            </div>
        `;
        activityListContainer.appendChild(newActivityItem);
        
        // Pasang formatter ke input biaya yang baru dibuat
        const newInput = newActivityItem.querySelector('.input-nominal');
        attachNominalFormatter(newInput);
    });
}

if (dailyActivityForm) {
    dailyActivityForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const lokasiKota = document.getElementById('lokasi-kota').value;
        
        // Ambil nominal pendapatan (bersihkan titik)
        const pendapatanRaw = document.getElementById('pendapatan-bulanan').value;
        const pendapatanBulanan = parseFloat(pendapatanRaw.replace(/\./g, '')) || 0;

        let totalBiayaHarian = 0;
        const activities = [];
        
        let isValid = true;
        for (let i = 1; i <= activityCount; i++) {
            // Cek apakah elemen ada (jika nanti ada fitur hapus)
            const actInput = document.getElementById(`aktivitas-${i}`);
            if (!actInput) continue;

            const aktivitas = actInput.value;
            
            // Ambil nominal biaya per item (bersihkan titik)
            const biayaRaw = document.getElementById(`biaya-${i}`).value;
            const biaya = parseFloat(biayaRaw.replace(/\./g, '')) || 0;
            
            const kategori = document.getElementById(`kategori-${i}`).value;

            if (!aktivitas || isNaN(biaya) || biaya <= 0 || !kategori) {
                isValid = false;
                break;
            }

            activities.push({ aktivitas, biaya, kategori });
            totalBiayaHarian += biaya;
        }

        if (!lokasiKota || pendapatanBulanan <= 0 || !isValid) {
            dailyBudgetResultContainer.innerHTML = '<p style="color: red;">Mohon isi semua data dengan valid.</p>';
            dailyBudgetResultContainer.style.display = 'block';
            return;
        }

        dailyBudgetResultContainer.innerHTML = '<p>AI sedang merancang anggaran harian...</p>';
        dailyBudgetResultContainer.style.display = 'block';

        const totalBiayaBulanan = totalBiayaHarian * 30;
        const sisaDanaBulanan = pendapatanBulanan - totalBiayaBulanan;
        const rasioPengeluaranHarian = (totalBiayaHarian / (pendapatanBulanan / 30)) * 100;

        const prompt = `
            Sebagai ahli perencana keuangan, berikan analisis dan saran untuk rancangan biaya aktivitas harian ini:
            - Lokasi: ${lokasiKota}
            - Pendapatan Bulanan: Rp ${pendapatanBulanan.toLocaleString('id-ID')}
            - Total Biaya Harian: Rp ${totalBiayaHarian.toLocaleString('id-ID')}
            - Estimasi Total Biaya Bulanan (jika pola sama setiap hari): Rp ${totalBiayaBulanan.toLocaleString('id-ID')}
            - Sisa Dana Bulanan: Rp ${sisaDanaBulanan.toLocaleString('id-ID')}
            - Rasio Pengeluaran Harian terhadap Pendapatan Harian: ${rasioPengeluaranHarian.toFixed(1)}%

            **Daftar Aktivitas:**
            ${activities.map(a => `- ${a.aktivitas} (${a.kategori}): Rp ${a.biaya.toLocaleString('id-ID')}`).join('\n')}

            Berikan analisis mendalam tentang pola pengeluaran, apakah boros atau hemat? Berikan saran spesifik untuk efisiensi berdasarkan kategori pengeluaran tersebut.
        `;

        const requestData = { contents: [{ parts: [{ text: prompt }] }] };
       fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json()).then(data => {
                if (data.candidates && data.candidates[0].content) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    const formattedResponse = marked.parse(aiResponse);
                    
                    dailyBudgetResultContainer.innerHTML = `<h4>Rancangan Biaya Harian AI Ruang Finansial:</h4>`;
                    const resultDiv = document.createElement('div');
                    resultDiv.innerHTML = formattedResponse;
                    dailyBudgetResultContainer.appendChild(resultDiv);
                    // typeWriterEffect(resultDiv, formattedResponse);
                } else { dailyBudgetResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat memberikan respons.</p>'; }
            }).catch(err => {
                console.error(err);
                dailyBudgetResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
            });
    });
}
// ===== KALKULATOR GREEN FINANCIAL =====
// ===== KALKULATOR GREEN FINANCIAL (UPDATE FORMAT NOMINAL) =====
const greenFinancialForm = document.getElementById('green-financial-form');
const greenFinancialResultContainer = document.getElementById('green-financial-result');

if (greenFinancialForm) {
    greenFinancialForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // --- AMBIL & BERSIHKAN INPUT NOMINAL (Hapus titik) ---
        const monthlyIncomeRaw = document.getElementById('monthly-income-green').value;
        const monthlyIncome = parseFloat(monthlyIncomeRaw.replace(/\./g, '')) || 0;

        const greenSpendingRaw = document.getElementById('green-spending').value;
        const greenSpending = parseFloat(greenSpendingRaw.replace(/\./g, '')) || 0;

        const brownSpendingRaw = document.getElementById('brown-spending').value;
        const brownSpending = parseFloat(brownSpendingRaw.replace(/\./g, '')) || 0;

        const otherSpendingRaw = document.getElementById('other-spending').value;
        const otherSpending = parseFloat(otherSpendingRaw.replace(/\./g, '')) || 0;

        const greenInvestmentRaw = document.getElementById('green-investment').value;
        const greenInvestment = parseFloat(greenInvestmentRaw.replace(/\./g, '')) || 0;

        const brownInvestmentRaw = document.getElementById('brown-investment').value;
        const brownInvestment = parseFloat(brownInvestmentRaw.replace(/\./g, '')) || 0;

        // Validasi dasar
        if (monthlyIncome <= 0) {
            greenFinancialResultContainer.innerHTML = '<p style="color: red;">Mohon isi penghasilan dengan valid.</p>';
            greenFinancialResultContainer.style.display = 'block';
            return;
        }

        greenFinancialResultContainer.innerHTML = '<p>AI sedang menganalisis jejak finansial Anda...</p>';
        greenFinancialResultContainer.style.display = 'block';

        const totalSpending = greenSpending + brownSpending + otherSpending;
        const greenRatio = totalSpending > 0 ? (greenSpending / totalSpending) * 100 : 0;
        const brownRatio = totalSpending > 0 ? (brownSpending / totalSpending) * 100 : 0;
        
        const totalInvestment = greenInvestment + brownInvestment;
        const greenInvestmentRatio = totalInvestment > 0 ? (greenInvestment / totalInvestment) * 100 : 0;

        const prompt = `
            Sebagai ahli keuangan dan keberlanjutan, berikan analisis komprehensif dari perspektif "green financial" untuk data berikut:
            
            **Data Keuangan:**
            - Penghasilan Bulanan: Rp ${monthlyIncome.toLocaleString('id-ID')}
            - Total Pengeluaran: Rp ${totalSpending.toLocaleString('id-ID')}
            - Total Investasi: Rp ${totalInvestment.toLocaleString('id-ID')}
            
            **Analisis Jejak Keuangan:**
            - Rasio Pengeluaran Hijau (Ramah Lingkungan): ${greenRatio.toFixed(1)}%
            - Rasio Pengeluaran Karbon Tinggi: ${brownRatio.toFixed(1)}%
            - Rasio Investasi Hijau: ${greenInvestmentRatio.toFixed(1)}%
            
            Berdasarkan data di atas, berikan analisis mendalam tentang jejak finansial pengguna. Jelaskan apa arti rasio-rasio tersebut bagi lingkungan dan keuangan jangka panjang. Berikan strategi dan saran terperinci untuk mengelola keuangan agar lebih ramah lingkungan (transisi ke green economy).
        `;

        const requestData = { contents: [{ parts: [{ text: prompt }] }] };
     fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json()).then(data => {
                if (data.candidates && data.candidates[0].content) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    const formattedResponse = marked.parse(aiResponse);
                    
                    greenFinancialResultContainer.innerHTML = `<h4>Analisis Green Financial AI Ruang Finansial:</h4>`;
                    const resultDiv = document.createElement('div');
                    resultDiv.innerHTML = formattedResponse;
                    greenFinancialResultContainer.appendChild(resultDiv);
                    
                    // typeWriterEffect(resultDiv, formattedResponse);
                } else { greenFinancialResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat memberikan respons.</p>'; }
            }).catch(err => {
                console.error(err);
                greenFinancialResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
            });
    });
}
// ===== KALKULATOR GREEN BUSINESS =====
// ===== KALKULATOR GREEN BUSINESS (UPDATE FORMAT NOMINAL) =====
const greenBusinessForm = document.getElementById('green-business-form');
const greenBusinessResultContainer = document.getElementById('green-business-result');

if (greenBusinessForm) {
    greenBusinessForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // --- AMBIL & BERSIHKAN INPUT NOMINAL (Hanya Biaya Bahan Baku) ---
        const rawMaterialCostRaw = document.getElementById('raw-material-cost').value;
        const rawMaterialCost = parseFloat(rawMaterialCostRaw.replace(/\./g, '')) || 0;

        // Ambil input unit fisik (Tetap number)
        const energyConsumption = parseFloat(document.getElementById('energy-consumption').value);
        const ecoFriendlyMaterial = parseFloat(document.getElementById('eco-friendly-material').value);
        const wasteProduction = parseFloat(document.getElementById('waste-production').value);
        const deliveryDistance = parseFloat(document.getElementById('delivery-distance').value);
        const employeeCount = parseInt(document.getElementById('employee-count').value);

        if (isNaN(energyConsumption) || isNaN(rawMaterialCost) || isNaN(ecoFriendlyMaterial) || isNaN(wasteProduction) || isNaN(deliveryDistance) || isNaN(employeeCount)) {
            greenBusinessResultContainer.innerHTML = '<p style="color: red;">Mohon isi semua data dengan valid.</p>';
            greenBusinessResultContainer.style.display = 'block';
            return;
        }

        greenBusinessResultContainer.innerHTML = '<p>AI sedang menganalisis Green Score bisnis Anda...</p>';
        greenBusinessResultContainer.style.display = 'block';

        // Perhitungan sederhana untuk simulasi green score
        // 1. Energi: Semakin rendah per karyawan, semakin baik
        const energyScore = Math.max(0, 100 - (energyConsumption / employeeCount)); 
        
        // 2. Material: Langsung dari persentase
        const materialScore = ecoFriendlyMaterial; 
        
        // 3. Limbah: Semakin rendah per karyawan, semakin baik
        const wasteScore = Math.max(0, 100 - ((wasteProduction / employeeCount) * 2)); 
        
        // 4. Distribusi: Semakin pendek jarak, semakin baik
        const distScore = Math.max(0, 100 - deliveryDistance);

        const greenScore = (energyScore + materialScore + wasteScore + distScore) / 4;
        
        const prompt = `
            Sebagai ahli keberlanjutan (ESG dan SDGs) untuk bisnis, berikan analisis dan rekomendasi untuk Green Score bisnis berikut:
            
            **Data Operasional:**
            - Konsumsi Energi Bulanan: ${energyConsumption} kWh
            - Biaya Bahan Baku: Rp ${rawMaterialCost.toLocaleString('id-ID')}
            - Persentase Bahan Baku Ramah Lingkungan: ${ecoFriendlyMaterial}%
            - Produksi Limbah Bulanan: ${wasteProduction} kg
            - Jarak Distribusi Rata-rata: ${deliveryDistance} km
            - Jumlah Karyawan: ${employeeCount} orang
            
            **Hasil Analisis Awal:**
            - Estimasi Green Score: ${greenScore.toFixed(1)} dari 100
            
            Berdasarkan data di atas, jelaskan posisi keberlanjutan bisnis ini. Berikan rekomendasi strategi hijau yang sesuai, seperti cara mengurangi jejak karbon, efisiensi energi, dan manajemen limbah. Jelaskan juga manfaat ekonomi dari penerapan strategi ini (misal: efisiensi biaya bahan baku Rp ${rawMaterialCost.toLocaleString('id-ID')}).
        `;

        const requestData = { contents: [{ parts: [{ text: prompt }] }] };
      fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json()).then(data => {
                if (data.candidates && data.candidates[0].content) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    const formattedResponse = marked.parse(aiResponse);
                    
                    greenBusinessResultContainer.innerHTML = `<h4>Analisis Green Business AI Ruang Finansial:</h4>`;
                    
                    // Ringkasan Score
                    const scoreDiv = document.createElement('div');
                    scoreDiv.style.marginBottom = '15px';
                    scoreDiv.style.padding = '15px';
                    scoreDiv.style.backgroundColor = '#f1f8e9';
                    scoreDiv.style.borderRadius = '10px';
                    scoreDiv.style.borderLeft = '5px solid #8bc34a';
                    scoreDiv.innerHTML = `
                        <p style="margin:0; font-size:1.2em;"><strong>Green Score Anda: ${greenScore.toFixed(1)}/100</strong></p>
                    `;
                    greenBusinessResultContainer.appendChild(scoreDiv);

                    const resultDiv = document.createElement('div');
                    resultDiv.innerHTML = formattedResponse;
                    greenBusinessResultContainer.appendChild(resultDiv);
                    
                    // typeWriterEffect(resultDiv, formattedResponse);
                } else {
                    greenBusinessResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat memberikan respons.</p>';
                }
            }).catch(err => {
                console.error(err);
                greenBusinessResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
            });
    });
}
// ===== KALKULATOR JEJAK KARBON =====
// ===== KALKULATOR JEJAK KARBON (UPDATE FORMAT NOMINAL) =====
const carbonForm = document.getElementById('carbon-form');
const carbonResultContainer = document.getElementById('carbon-result');

if (carbonForm) {
    carbonForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // --- AMBIL & BERSIHKAN INPUT NOMINAL (Untuk yang diganti text) ---
        const listrikRaw = document.getElementById('listrik-bulanan').value;
        const listrikBulanan = parseFloat(listrikRaw.replace(/\./g, '')) || 0;

        const gasRaw = document.getElementById('gas-bulanan').value;
        const gasBulanan = parseFloat(gasRaw.replace(/\./g, '')) || 0;

        const jarakMobilRaw = document.getElementById('jarak-mobil').value;
        const jarakMobil = parseFloat(jarakMobilRaw.replace(/\./g, '')) || 0;

        const jarakMotorRaw = document.getElementById('jarak-motor').value;
        const jarakMotor = parseFloat(jarakMotorRaw.replace(/\./g, '')) || 0;

        const jarakPesawatRaw = document.getElementById('jarak-pesawat').value;
        const jarakPesawat = parseFloat(jarakPesawatRaw.replace(/\./g, '')) || 0;

        const konsumsiDagingRaw = document.getElementById('konsumsi-daging').value;
        const konsumsiDaging = parseFloat(konsumsiDagingRaw.replace(/\./g, '')) || 0;

        const botolRaw = document.getElementById('botol-sekali-pakai').value;
        const botolSekaliPakai = parseFloat(botolRaw.replace(/\./g, '')) || 0;

        // Ambil input yang tetap number (karena butuh desimal)
        const konsumsiSusu = parseFloat(document.getElementById('konsumsi-susu').value) || 0;
        const sampahRumahTangga = parseFloat(document.getElementById('sampah-rumah-tangga').value) || 0;

        // Validasi dasar
        // (Boleh 0 jika user tidak melakukan aktivitas tsb)
        
        carbonResultContainer.innerHTML = '<p>AI sedang menghitung jejak karbon Anda...</p>';
        carbonResultContainer.style.display = 'block';
        
        // Asumsi koefisien emisi (kg CO₂e per unit)
        const emisiListrik = listrikBulanan * 0.495 * 12; 
        const emisiGas = gasBulanan * 2.75 * 12; 
        const emisiMobil = jarakMobil * 0.17 * 12; 
        const emisiMotor = jarakMotor * 0.05 * 12; 
        const emisiPesawat = jarakPesawat * 0.15; 
        const emisiDaging = konsumsiDaging * 5.75 * 52; 
        const emisiSusu = konsumsiSusu * 2.2 * 52; 
        const emisiBotol = botolSekaliPakai * 0.08 * 12; 
        const emisiSampah = sampahRumahTangga * 1.5 * 52; 

        const totalEmisiTahunan = (
            emisiListrik + emisiGas + emisiMobil + emisiMotor + emisiPesawat +
            emisiDaging + emisiSusu + emisiBotol + emisiSampah
        );
        
        const prompt = `
            Sebagai ahli keberlanjutan dan lingkungan, berikan analisis jejak karbon pribadi berdasarkan data berikut:
            
            **Data Gaya Hidup:**
            - Penggunaan Listrik Tahunan: ${listrikBulanan * 12} kWh
            - Jarak Tempuh Kendaraan (Darat+Udara) Tahunan: ${((jarakMobil+jarakMotor)*12 + jarakPesawat).toLocaleString('id-ID')} km
            - Konsumsi Daging Tahunan: ${konsumsiDaging * 52} gram
            - Total Emisi Karbon Tahunan Anda: ${totalEmisiTahunan.toLocaleString('id-ID', { maximumFractionDigits: 2 })} kg CO₂e
            
            Berdasarkan data di atas, berikan analisis mendalam. Bandingkan emisi Anda dengan rata-rata global (sekitar 4.500 kg CO2e) dan berikan 5 rekomendasi praktis untuk mengurangi jejak karbon tersebut.
        `;

        const requestData = { contents: [{ parts: [{ text: prompt }] }] };
     fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json()).then(data => {
                if (data.candidates && data.candidates[0].content) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    const formattedResponse = marked.parse(aiResponse);
                    
                    carbonResultContainer.innerHTML = `<h4>Analisis Jejak Karbon AI Ruang Finansial:</h4>`;
                    const resultDiv = document.createElement('div');
                    resultDiv.innerHTML = formattedResponse;
                    carbonResultContainer.appendChild(resultDiv);
                    // typeWriterEffect(resultDiv, formattedResponse);
                } else { carbonResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat memberikan respons.</p>'; }
            }).catch(err => {
                console.error(err);
                carbonResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
            });
    });
}
// ===== Fungsionalitas News Slider =====


// Event listener ke semua input biaya

// ===== Fungsionalitas Event Slider =====
// ===== Fungsionalitas Event Slider =====



    const bizForm = document.getElementById('biz-report-form');
    const bizOutput = document.getElementById('biz-report-output');

    // --- 1. CORE FORMATTER (ANTI GLITCH) ---
    function formatRupiahV3(value) {
        if (!value) return '';
        let clean = value.toString().replace(/[^0-9]/g, '');
        if (clean === '') return '';
        
        let numberString = clean.toString(),
            sisa = numberString.length % 3,
            rupiah = numberString.substr(0, sisa),
            ribuan = numberString.substr(sisa).match(/\d{3}/g);

        if (ribuan) {
            let separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }
        return 'Rp ' + rupiah;
    }

    function parseRupiah(value) {
        if (!value) return 0;
        return parseInt(value.toString().replace(/[^0-9]/g, '')) || 0;
    }

    function attachFormatter(input) {
        input.addEventListener('input', function() {
            this.value = formatRupiahV3(this.value);
        });
    }

    // Init existing inputs
    if(bizForm) {
        bizForm.querySelectorAll('.currency-field').forEach(inp => attachFormatter(inp));
    }

    // --- 2. DYNAMIC ROW FUNCTION ---
    // Dipanggil dari onclick HTML
    window.addBizRow = function(containerId, calcClass) {
        const container = document.getElementById(containerId);
        const div = document.createElement('div');
        div.className = 'dynamic-row-wrapper';

        div.innerHTML = `
            <input type="text" class="aurora-input dynamic-name" placeholder="Nama Akun (Cth: Iklan FB)" required>
            <input type="text" class="aurora-input currency-field ${calcClass} dynamic-val" placeholder="Rp 0" required>
            <button type="button" class="btn-del-row" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>
        `;

        container.appendChild(div);
        attachFormatter(div.querySelector('.currency-field'));
    };

    // --- 3. HELPER: SUM BY CLASS ---
    // Menjumlahkan semua input dengan class tertentu (misal: semua .calc-revenue)
    function sumByClass(className) {
        let total = 0;
        let details = [];

        if(bizForm) {
            const inputs = bizForm.querySelectorAll('.' + className);
            inputs.forEach(input => {
                const val = parseRupiah(input.value);
                let label = "Item";

                // Cek labelnya (apakah statis dari <label> atau dinamis dari input teks)
                if(input.parentElement.classList.contains('input-row')) {
                    // Statis
                    label = input.previousElementSibling.innerText;
                } else if(input.parentElement.classList.contains('dynamic-row-wrapper')) {
                    // Dinamis
                    label = input.parentElement.querySelector('.dynamic-name').value || "Lainnya";
                }

                if(val > 0) {
                    total += val;
                    details.push({ label, value: val });
                }
            });
        }
        return { total, details };
    }

    // --- 4. SUBMIT & CALCULATE ---
    if(bizForm) {
        bizForm.addEventListener('submit', function(e) {
            e.preventDefault();

            bizOutput.style.display = 'block';
            bizOutput.innerHTML = '<div style="text-align:center; padding:40px;"><div class="loading-spinner"></div><h3 style="color:#334155; margin-top:20px;">Menyusun Laporan Bisnis...</h3></div>';

            // Ambil Identitas
            const meta = {
                name: document.getElementById('biz-name').value,
                period: document.getElementById('biz-period').value,
                owner: document.getElementById('biz-owner').value
            };

            // Hitung Data Berdasarkan Class Input
            const revenueData = sumByClass('calc-revenue');
            const cogsData = sumByClass('calc-cogs');
            const opexData = sumByClass('calc-opex');
            const assetData = sumByClass('calc-asset');
            const liabData = sumByClass('calc-liab');
            const equityData = sumByClass('calc-equity');

            // Kalkulasi Laba Rugi
            const grossProfit = revenueData.total - cogsData.total;
            const operatingProfit = grossProfit - opexData.total;
            const netIncome = operatingProfit; // (Bisa tambah pajak/bunga jika perlu)

            // Kalkulasi Neraca
            // Check Balance: Asset = Liab + Equity + Retained Earnings (Net Income)
            const totalAsset = assetData.total;
            const totalLiab = liabData.total;
            const totalEquity = equityData.total + netIncome; 
            const balanceCheck = totalAsset - (totalLiab + totalEquity);

            const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID');

            // Helper Row Generator
            const rowHTML = (items) => items.map(i => `<tr><td style="padding:5px 0;">${i.label}</td><td style="text-align:right;">${fmt(i.value)}</td></tr>`).join('');

            // --- HTML REPORT TEMPLATE ---
            const reportHTML = `
                <div class="biz-report-wrapper" style="font-family: 'Georgia', serif; color: #111; line-height: 1.5; padding: 20px;">
                    
                    <div style="text-align:center; margin-bottom: 40px;">
                        <h1 style="font-family: 'Helvetica', sans-serif; text-transform:uppercase; letter-spacing:2px; margin:0; font-size:26px; color:#1e293b;">${meta.name}</h1>
                        <p style="margin:5px 0 0; font-size:14px; color:#64748b;">Laporan Keuangan | Periode: ${meta.period}</p>
                        <div style="width:100px; height:3px; background:#1e293b; margin:15px auto;"></div>
                    </div>

                    <h3 style="background:#f1f5f9; padding:8px 15px; font-family: 'Helvetica', sans-serif; font-size:14px; text-transform:uppercase; margin-bottom:15px; border-left:5px solid #0f172a;">I. Laporan Laba Rugi (Income Statement)</h3>
                    
                    <table style="width:100%; border-collapse:collapse; font-size:13px; margin-bottom:30px;">
                        <tr><td colspan="2" style="font-weight:bold; padding-top:10px;">PENDAPATAN</td></tr>
                        ${rowHTML(revenueData.details)}
                        <tr style="border-top:1px solid #ccc;"><td style="font-weight:bold; padding:5px 0;">Total Pendapatan</td><td style="text-align:right; font-weight:bold;">${fmt(revenueData.total)}</td></tr>

                        <tr><td colspan="2" style="font-weight:bold; padding-top:15px;">HARGA POKOK PENJUALAN (HPP)</td></tr>
                        ${rowHTML(cogsData.details)}
                        <tr style="border-top:1px solid #ccc;"><td style="font-weight:bold; padding:5px 0;">Total HPP</td><td style="text-align:right; font-weight:bold;">(${fmt(cogsData.total)})</td></tr>

                        <tr style="background:#f8fafc;"><td style="font-weight:bold; padding:10px 0;">LABA KOTOR</td><td style="text-align:right; font-weight:bold;">${fmt(grossProfit)}</td></tr>

                        <tr><td colspan="2" style="font-weight:bold; padding-top:15px;">BEBAN OPERASIONAL</td></tr>
                        ${rowHTML(opexData.details)}
                        <tr style="border-top:1px solid #ccc;"><td style="font-weight:bold; padding:5px 0;">Total Beban</td><td style="text-align:right; font-weight:bold;">(${fmt(opexData.total)})</td></tr>

                        <tr style="background:#e2e8f0; font-size:14px;">
                            <td style="font-weight:bold; padding:10px 0;">LABA BERSIH (NET INCOME)</td>
                            <td style="text-align:right; font-weight:bold;">${fmt(netIncome)}</td>
                        </tr>
                    </table>

                    <h3 style="background:#f1f5f9; padding:8px 15px; font-family: 'Helvetica', sans-serif; font-size:14px; text-transform:uppercase; margin-bottom:15px; border-left:5px solid #0f172a;">II. Laporan Posisi Keuangan (Neraca)</h3>
                    
                    <table style="width:100%; border-collapse:collapse; font-size:13px; margin-bottom:30px;">
                        <tr>
                            <td style="vertical-align:top; width:50%; padding-right:15px;">
                                <div style="font-weight:bold; border-bottom:1px solid #ccc; margin-bottom:5px;">ASET</div>
                                <table style="width:100%;">
                                    ${rowHTML(assetData.details)}
                                    <tr style="border-top:2px solid #333;"><td style="font-weight:bold; padding-top:5px;">TOTAL ASET</td><td style="text-align:right; font-weight:bold;">${fmt(totalAsset)}</td></tr>
                                </table>
                            </td>
                            <td style="vertical-align:top; width:50%; padding-left:15px;">
                                <div style="font-weight:bold; border-bottom:1px solid #ccc; margin-bottom:5px;">KEWAJIBAN & EKUITAS</div>
                                <table style="width:100%;">
                                    ${rowHTML(liabData.details)}
                                    <tr style="border-top:1px solid #ccc;"><td style="font-weight:bold; padding:5px 0;">Total Liabilitas</td><td style="text-align:right;">${fmt(totalLiab)}</td></tr>
                                    
                                    <tr><td colspan="2" style="height:10px;"></td></tr>
                                    ${rowHTML(equityData.details)}
                                    <tr><td>Laba Tahun Berjalan</td><td style="text-align:right;">${fmt(netIncome)}</td></tr>
                                    
                                    <tr style="border-top:2px solid #333;"><td style="font-weight:bold; padding-top:5px;">TOTAL PASIVA</td><td style="text-align:right; font-weight:bold;">${fmt(totalLiab + totalEquity)}</td></tr>
                                </table>
                            </td>
                        </tr>
                    </table>

                     <div style="margin-top:50px; display:flex; justify-content:space-between; font-size:12px; font-family: 'Helvetica', sans-serif;">
                        <div style="text-align:center; width:200px;">
                            <p>Dibuat Oleh,</p>
                            <br><br><br>
                            <p style="font-weight:bold; border-top:1px solid #333;">( Admin Keuangan )</p>
                        </div>
                        <div style="text-align:center; width:200px;">
                            <p>Disetujui Oleh,</p>
                            <br><br><br>
                            <p style="font-weight:bold; border-top:1px solid #333;">( ${meta.owner} )</p>
                        </div>
                    </div>
                </div>
            `;

            bizOutput.innerHTML = reportHTML;
            bizOutput.innerHTML += '<div style="text-align:center; margin-top:20px; color:#334155; font-size:0.9rem;"><i class="fas fa-file-pdf"></i> Mengunduh PDF...</div>';

            generateBizPDF(meta.name, reportHTML);
        });
    }

    async function generateBizPDF(filename, html) {
        const { jsPDF } = window.jspdf;
        const container = document.createElement('div');
        container.style.position = 'absolute'; container.style.left = '-9999px';
        container.style.width = '210mm'; container.style.padding = '15mm'; container.style.background = 'white';
        container.innerHTML = html;
        document.body.appendChild(container);

        try {
            const canvas = await html2canvas(container, { scale: 2, useCORS: true, windowWidth: container.scrollWidth });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfW = 210, pdfH = 297;
            const imgH = (canvas.height * pdfW) / canvas.width;
            let heightLeft = imgH, pos = 0;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfW, imgH);
            heightLeft -= pdfH;
            while(heightLeft > 0) {
                pos = heightLeft - imgH; pdf.addPage(); pdf.addImage(imgData, 'PNG', 0, pos, pdfW, imgH); heightLeft -= pdfH;
            }
            pdf.save(`Laporan_${filename.replace(/\s+/g, '_')}.pdf`);
        } catch (e) { console.error(e); } 
        finally { document.body.removeChild(container); }
    }


// ===== INSTANT REPORT GENERATOR =====



    const indForm = document.getElementById('ind-report-form');
    const indOutput = document.getElementById('ind-report-output');

    // --- 1. CORE FUNCTIONS ---

    function formatRupiahV2(value) {
        if (!value) return '';
        let clean = value.toString().replace(/[^0-9]/g, '');
        if (clean === '') return '';
        
        let numberString = clean.toString(),
            sisa = numberString.length % 3,
            rupiah = numberString.substr(0, sisa),
            ribuan = numberString.substr(sisa).match(/\d{3}/g);

        if (ribuan) {
            let separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }
        return 'Rp ' + rupiah;
    }

    function parseRupiah(value) {
        if (!value) return 0;
        return parseInt(value.toString().replace(/[^0-9]/g, '')) || 0;
    }

    // Fungsi Format saat mengetik (bisa dipanggil untuk elemen baru)
    function attachFormatter(input) {
        input.addEventListener('input', function() {
            this.value = formatRupiahV2(this.value);
        });
    }

    // Init formatter untuk input statis yang sudah ada
    if(indForm) {
        indForm.querySelectorAll('.currency-field').forEach(input => attachFormatter(input));
    }

    // --- 2. FITUR TAMBAH BARIS (DYNAMIC ROW) ---
    // Di-expose ke window agar bisa dipanggil onclick dari HTML
    window.addIndRow = function(containerId) {
        const container = document.getElementById(containerId);
        const div = document.createElement('div');
        div.className = 'dynamic-row-wrapper';

        div.innerHTML = `
            <input type="text" class="dynamic-input-name" placeholder="Nama Akun (Mis: Bonus)" required>
            <input type="text" class="sapphire-input dynamic-input-val currency-field" placeholder="Rp 0" required>
            <button type="button" class="btn-del-row" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>
        `;

        container.appendChild(div);

        // Pasang formatter ke input rupiah yang baru dibuat
        const newInputMoney = div.querySelector('.currency-field');
        attachFormatter(newInputMoney);
    };

    // --- 3. HELPER: HITUNG TOTAL PER KATEGORI ---
    // Fungsi ini loop semua input di dalam container tertentu
    function getCategoryData(containerId) {
        const container = document.getElementById(containerId);
        // Ambil input statis (yg punya label) & dinamis (yg punya placeholder nama)
        const inputs = container.querySelectorAll('.currency-field');
        
        let total = 0;
        let details = [];

        inputs.forEach(input => {
            const val = parseRupiah(input.value);
            let label = "";

            // Cek apakah ini baris statis atau dinamis
            if(input.parentElement.classList.contains('input-row')) {
                // Statis: Ambil dari label atau data-label
                label = input.dataset.label || input.previousElementSibling.innerText;
            } else if(input.parentElement.classList.contains('dynamic-row-wrapper')) {
                // Dinamis: Ambil dari input teks di sebelahnya
                label = input.parentElement.querySelector('.dynamic-input-name').value || "Lainnya";
            }

            if(val > 0) {
                total += val;
                details.push({ label: label, value: val });
            }
        });

        return { total, details };
    }

    // --- 4. SUBMIT & GENERATE REPORT ---
    if(indForm) {
        indForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            indOutput.style.display = 'block';
            indOutput.innerHTML = '<div style="text-align:center; padding:40px;"><div class="loading-spinner"></div><h3 style="color:#4f46e5; margin-top:20px;">Menyusun Laporan Dinamis...</h3></div>';

            // Ambil Identitas
            const identity = {
                nama: document.getElementById('ind-nama').value,
                usia: document.getElementById('ind-usia').value,
                job: document.getElementById('ind-pekerjaan').value,
            };

            // Hitung Dinamis Semua Kategori
            const incomeData = getCategoryData('container-income');
            const expenseData = getCategoryData('container-expense');
            const assetData = getCategoryData('container-asset');
            const liabilityData = getCategoryData('container-liability');

            // Kalkulasi Akhir
            const cashFlow = incomeData.total - expenseData.total;
            const netWorth = assetData.total - liabilityData.total;
            
            // Rasio
            const savingsRate = incomeData.total > 0 ? ((cashFlow / incomeData.total) * 100) : 0;
            const debtRatio = assetData.total > 0 ? ((liabilityData.total / assetData.total) * 100) : 0;

            const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID');
            const fmtDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

            // Helper: Generate Table Rows HTML
            function generateRowsHTML(details) {
                return details.map(item => `
                    <tr>
                        <td style="padding:5px 15px;">${item.label}</td>
                        <td style="text-align:right;">${fmt(item.value)}</td>
                    </tr>
                `).join('');
            }

            // HTML Template Report
            const reportHTML = `
                <div class="official-report-wrapper" style="font-family: 'Times New Roman', serif; color: #111; line-height: 1.4; padding: 10px;">
                    
                    <div style="text-align:center; border-bottom: 3px double #333; padding-bottom: 20px; margin-bottom: 30px;">
                        <h2 style="font-family: Arial, sans-serif; text-transform:uppercase; letter-spacing:2px; margin:0; font-size:24px;">Laporan Keuangan Pribadi</h2>
                        <p style="margin:5px 0 0; font-size:14px; color:#555;">Periode: ${fmtDate}</p>
                    </div>

                    <table style="width:100%; margin-bottom:30px; font-family: Arial, sans-serif; font-size:12px;">
                        <tr>
                            <td style="width:15%; font-weight:bold;">Nama</td>
                            <td style="width:35%">: ${identity.nama}</td>
                            <td style="width:15%; font-weight:bold;">Profesi</td>
                            <td style="width:35%">: ${identity.job}</td>
                        </tr>
                        <tr>
                            <td style="font-weight:bold;">Usia</td>
                            <td>: ${identity.usia} Tahun</td>
                            <td style="font-weight:bold;">Status</td>
                            <td>: Verified</td>
                        </tr>
                    </table>

                    <div style="border: 1px solid #333; padding: 15px; margin-bottom: 30px; background: #fdfdfd;">
                        <div style="display:flex; justify-content:space-between; font-family: Arial, sans-serif;">
                            <div>
                                <span style="font-size:11px; color:#666;">KEKAYAAN BERSIH (NET WORTH)</span>
                                <div style="font-size:18px; font-weight:bold; margin-top:5px;">${fmt(netWorth)}</div>
                            </div>
                            <div style="text-align:right;">
                                <span style="font-size:11px; color:#666;">ARUS KAS BERSIH (NET CASH FLOW)</span>
                                <div style="font-size:18px; font-weight:bold; margin-top:5px; color:${cashFlow >= 0 ? '#10b981' : '#ef4444'}">${fmt(cashFlow)}</div>
                            </div>
                        </div>
                    </div>

                    <h3 style="background:#eee; padding:5px 10px; font-family: Arial, sans-serif; font-size:12px; margin-bottom:10px; border-left:4px solid #333;">I. ARUS KAS (CASH FLOW)</h3>
                    <table style="width:100%; border-collapse:collapse; margin-bottom:25px; font-size:12px;">
                        <tr style="background:#fafafa;"><td colspan="2" style="padding:5px; font-weight:bold;">PENDAPATAN</td></tr>
                        ${generateRowsHTML(incomeData.details)}
                        <tr style="border-top:1px solid #ccc;"><td style="padding:5px 15px; font-weight:bold;">Total Pendapatan</td><td style="text-align:right; font-weight:bold;">${fmt(incomeData.total)}</td></tr>

                        <tr style="background:#fafafa;"><td colspan="2" style="padding:5px; font-weight:bold; padding-top:15px;">PENGELUARAN</td></tr>
                        ${generateRowsHTML(expenseData.details)}
                        <tr style="border-top:1px solid #ccc;"><td style="padding:5px 15px; font-weight:bold;">Total Pengeluaran</td><td style="text-align:right; font-weight:bold;">(${fmt(expenseData.total)})</td></tr>
                    </table>

                    <h3 style="background:#eee; padding:5px 10px; font-family: Arial, sans-serif; font-size:12px; margin-bottom:10px; border-left:4px solid #333;">II. NERACA (BALANCE SHEET)</h3>
                    <table style="width:100%; border-collapse:collapse; margin-bottom:25px; font-size:12px;">
                         <tr>
                            <td style="vertical-align:top; width:50%; padding-right:10px;">
                                <table style="width:100%;">
                                    <tr style="background:#fafafa;"><td colspan="2" style="padding:5px; font-weight:bold; border-bottom:1px solid #ddd;">ASET</td></tr>
                                    ${generateRowsHTML(assetData.details)}
                                    <tr style="border-top:1px solid #333;"><td style="padding:5px; font-weight:bold;">Total Aset</td><td style="text-align:right; font-weight:bold;">${fmt(assetData.total)}</td></tr>
                                </table>
                            </td>
                            <td style="vertical-align:top; width:50%; padding-left:10px;">
                                <table style="width:100%;">
                                    <tr style="background:#fafafa;"><td colspan="2" style="padding:5px; font-weight:bold; border-bottom:1px solid #ddd;">KEWAJIBAN</td></tr>
                                    ${generateRowsHTML(liabilityData.details)}
                                    <tr style="border-top:1px solid #333;"><td style="padding:5px; font-weight:bold;">Total Utang</td><td style="text-align:right; font-weight:bold;">${fmt(liabilityData.total)}</td></tr>
                                </table>
                            </td>
                        </tr>
                    </table>

                    <h3 style="background:#eee; padding:5px 10px; font-family: Arial, sans-serif; font-size:12px; margin-bottom:10px; border-left:4px solid #333;">III. RASIO KEUANGAN</h3>
                    <table style="width:100%; border-collapse:collapse; font-size:12px; border:1px solid #ddd;">
                        <tr style="background:#333; color:white;">
                            <th style="padding:8px;">Indikator</th>
                            <th style="padding:8px; text-align:center;">Nilai</th>
                            <th style="padding:8px; text-align:center;">Status</th>
                        </tr>
                        <tr>
                            <td style="padding:8px; border-bottom:1px solid #eee;">Savings Rate</td>
                            <td style="padding:8px; text-align:center; border-bottom:1px solid #eee;">${savingsRate.toFixed(1)}%</td>
                            <td style="padding:8px; text-align:center; border-bottom:1px solid #eee; font-weight:bold; color:${savingsRate >= 10 ? 'green' : 'red'};">${savingsRate >= 10 ? 'SEHAT' : 'KURANG'}</td>
                        </tr>
                        <tr>
                            <td style="padding:8px; border-bottom:1px solid #eee;">Debt Ratio</td>
                            <td style="padding:8px; text-align:center; border-bottom:1px solid #eee;">${debtRatio.toFixed(1)}%</td>
                            <td style="padding:8px; text-align:center; border-bottom:1px solid #eee; font-weight:bold; color:${debtRatio <= 50 ? 'green' : 'red'};">${debtRatio <= 50 ? 'AMAN' : 'BERISIKO'}</td>
                        </tr>
                    </table>
                </div>
            `;

            indOutput.innerHTML = reportHTML;
            indOutput.innerHTML += '<div style="text-align:center; margin-top:20px; color:#4f46e5; font-size:0.9rem;"><i class="fas fa-spinner fa-spin"></i> Memproses PDF...</div>';

            // Generate PDF
            generatePDFDynamic(identity.nama, reportHTML);
        });
    }

    async function generatePDFDynamic(filename, html) {
        const { jsPDF } = window.jspdf;
        
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.width = '210mm';
        container.style.padding = '15mm';
        container.style.background = 'white';
        container.innerHTML = html;
        document.body.appendChild(container);

        try {
            const canvas = await html2canvas(container, { scale: 2, useCORS: true, windowWidth: container.scrollWidth });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfW = 210, pdfH = 297;
            const imgH = (canvas.height * pdfW) / canvas.width;
            
            let heightLeft = imgH, pos = 0;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfW, imgH);
            heightLeft -= pdfH;

            while (heightLeft > 0) {
                pos = heightLeft - imgH;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, pos, pdfW, imgH);
                heightLeft -= pdfH;
            }
            pdf.save(`Laporan_${filename.replace(/\s+/g, '_')}.pdf`);
            
            const msg = indOutput.querySelector('.fa-spinner').parentElement;
            msg.innerHTML = '<i class="fas fa-check-circle"></i> PDF Berhasil Diunduh';
            msg.style.color = 'green';
        } catch (e) {
            console.error(e);
        } finally {
            document.body.removeChild(container);
        }
    }

    
// ===== FITUR UMKM BUDGETING INSTAN & PDF GENERATOR (VERSI DIPERBAIKI) =====
const umkmBudgetingForm = document.getElementById('umkm-budgeting-form');
const umkmBudgetingResultContainer = document.getElementById('umkm-budgeting-result');
const umkmLoadingContainer = document.getElementById('umkm-budgeting-loading');

const revenueCountInput = document.getElementById('revenue-count');
const revenueStreamContainer = document.getElementById('revenue-stream-container');
const addRevenueBtn = document.getElementById('add-revenue-btn');

const expenseCountInput = document.getElementById('expense-count');
const expenseItemContainer = document.getElementById('expense-item-container');
const addExpenseBtn = document.getElementById('add-expense-btn');

// Fungsi dinamis untuk menambah/mengubah form pendapatan tanpa menghapus data
// Fungsi dinamis untuk menambah/mengubah form pendapatan dengan format nominal
function manageRevenueStreams() {
    const newCount = parseInt(revenueCountInput.value) || 1;
    const currentCount = revenueStreamContainer.children.length;

    if (newCount > currentCount) {
        for (let i = currentCount + 1; i <= newCount; i++) {
            const div = document.createElement('div');
            div.classList.add('dynamic-form-group');
            div.innerHTML = `
                <hr>
                <h4>Sumber Pendapatan ${i}</h4>
                <div class="form-group">
                    <label for="rev-name-${i}">Nama Sumber Pendapatan</label>
                    <input type="text" id="rev-name-${i}" name="rev-name-${i}" required placeholder="Contoh: Penjualan Produk A">
                </div>
                <div class="form-group">
                    <label for="rev-type-${i}">Jenis Pendapatan</label>
                    <select id="rev-type-${i}" name="rev-type-${i}" required>
                        <option value="Penjualan langsung">Penjualan Langsung</option>
                        <option value="Langganan">Langganan</option>
                        <option value="Jasa">Jasa</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="rev-volume-${i}">Volume Penjualan per Periode</label>
                    <input type="text" id="rev-volume-${i}" name="rev-volume-${i}" class="input-nominal" required placeholder="Contoh: 100">
                </div>
                <div class="form-group">
                    <label for="rev-price-${i}">Harga Jual per Unit</label>
                    <input type="text" id="rev-price-${i}" name="rev-price-${i}" class="input-nominal" required placeholder="Contoh: 15.000">
                </div>
            `;
            revenueStreamContainer.appendChild(div);
            
            // Pasang formatter ke input baru
            const newInputs = div.querySelectorAll('.input-nominal');
            newInputs.forEach(input => attachNominalFormatter(input));
        }
    } else if (newCount < currentCount) {
        for (let i = currentCount; i > newCount; i--) {
            revenueStreamContainer.lastElementChild.remove();
        }
    }
}

// Fungsi dinamis untuk menambah/mengubah form pengeluaran tanpa menghapus data
// Fungsi dinamis untuk menambah/mengubah form pengeluaran dengan format nominal
function manageExpenseItems() {
    const newCount = parseInt(expenseCountInput.value) || 1;
    const currentCount = expenseItemContainer.children.length;

    if (newCount > currentCount) {
        for (let i = currentCount + 1; i <= newCount; i++) {
            const div = document.createElement('div');
            div.classList.add('dynamic-form-group');
            div.innerHTML = `
                <hr>
                <h4>Pos Pengeluaran ${i}</h4>
                <div class="form-group">
                    <label for="exp-name-${i}">Nama Pengeluaran</label>
                    <input type="text" id="exp-name-${i}" name="exp-name-${i}" required placeholder="Contoh: Gaji Karyawan, Bahan Baku Kopi">
                </div>
                <div class="form-group">
                    <label for="exp-type-${i}">Jenis Pengeluaran</label>
                    <select id="exp-type-${i}" name="exp-type-${i}" required>
                        <option value="OPEX">OPEX (Operational Expenditure)</option>
                        <option value="CAPEX">CAPEX (Capital Expenditure)</option>
                        <option value="HPP/COGS">HPP/COGS (Harga Pokok Penjualan)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="exp-nominal-${i}">Nominal Pengeluaran per Periode</label>
                    <input type="text" id="exp-nominal-${i}" name="exp-nominal-${i}" class="input-nominal" required placeholder="Contoh: 500.000">
                </div>
            `;
            expenseItemContainer.appendChild(div);
            
            // Pasang formatter ke input baru
            const newInput = div.querySelector('.input-nominal');
            attachNominalFormatter(newInput);
        }
    } else if (newCount < currentCount) {
        for (let i = currentCount; i > newCount; i--) {
            expenseItemContainer.lastElementChild.remove();
        }
    }
}

// Event listener untuk tombol dan input count
revenueCountInput.addEventListener('input', manageRevenueStreams);
expenseCountInput.addEventListener('input', manageExpenseItems);
addRevenueBtn.addEventListener('click', () => {
    revenueCountInput.value = (parseInt(revenueCountInput.value) || 0) + 1;
    manageRevenueStreams();
});
addExpenseBtn.addEventListener('click', () => {
    expenseCountInput.value = (parseInt(expenseCountInput.value) || 0) + 1;
    manageExpenseItems();
});

// Inisialisasi awal form
document.addEventListener('DOMContentLoaded', () => {
    manageRevenueStreams();
    manageExpenseItems();
});

// Fungsi untuk membuat dan mengunduh PDF
async function generateUMKMPDF(formData, aiResponseHtml) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    const pdfContent = document.createElement('div');
    pdfContent.setAttribute('id', 'pdf-temp-umkm-container');
    pdfContent.innerHTML = `
        <style>
            body, html { margin: 0; padding: 0; font-family: 'Poppins', sans-serif; box-sizing: border-box; }
            h1 { font-size: 28px; text-align: center; color: #4A55A2; border-bottom: 3px solid #4A55A2; padding-bottom: 15px; margin: 0 0 25px 0; }
            h2 { font-size: 22px; color: #2B3A67; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #E2E8F0; padding-bottom: 5px; }
            h3 { font-size: 18px; color: #4A55A2; margin-top: 20px; margin-bottom: 10px; }
            p, li { font-size: 14px; line-height: 1.6; color: #4A55A2; }
            .section { padding: 20px; background-color: #F7FAFC; border-radius: 10px; margin-bottom: 20px; }
            .page-break { page-break-before: always; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #E2E8F0; padding: 10px; text-align: left; }
            th { background-color: #EDF2F7; font-weight: 600; color: #2B3A67; }
            
            /* Gaya Khusus Laporan Keuangan Startup */
            .startup-table-wrapper { margin: 25px 0; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; }
            .startup-table { width: 100%; border-collapse: collapse; }
            .startup-table th, .startup-table td { padding: 12px 15px; border: none; }
            .startup-table thead th { background-color: #4A55A2; color: white; text-align: left; font-size: 14px; text-transform: uppercase; }
            .startup-table tbody tr:nth-child(even) { background-color: #F7FAFC; }
            .startup-table tbody tr:hover { background-color: #edf2f7; }
            .startup-table td { border-bottom: 1px solid #E2E8F0; }
            .startup-table .item-name { font-weight: 600; }
            .total-row th, .total-row td { background-color: #4A55A2 !important; color: white !important; font-weight: bold; font-size: 15px; }

            .cash-flow-table .income-row th, .cash-flow-table .income-row td { color: #10b981; font-weight: bold; }
            .cash-flow-table .expense-row th, .cash-flow-table .expense-row td { color: #ef4444; font-weight: bold; }
            .cash-flow-table .cash-in-hand td { background-color: #ECFDF5; }
            .cash-flow-table .net-cash td { background-color: #DBEAFE; }

            .balance-sheet-table .asset-category, .balance-sheet-table .liability-category { background-color: #EDF2F7; font-weight: bold; }
            .balance-sheet-table .total-asset-row, .balance-sheet-table .total-liability-equity-row { background-color: #4A55A2; color: white; font-weight: bold; }
            .balance-sheet-table .equity-section { margin-top: 20px; }
            .balance-sheet-table .liability-section { margin-bottom: 20px; }

            .insight-section { margin-top: 30px; padding: 20px; background-color: #DBEAFE; border-left: 5px solid #4A55A2; border-radius: 8px; }
        </style>
        <div style="padding: 20px;">
            <h1>Laporan Keuangan & Budgeting UMKM</h1>
            <div class="section">
                <h2>Informasi Dasar</h2>
                <p><strong>Nama Bisnis:</strong> ${formData['biz-name-umkm']}</p>
                <p><strong>Pemilik:</strong> ${formData['owner-name']}</p>
                <p><strong>Periode Laporan:</strong> ${formData['budget-period']} ${new Date().getFullYear()}</p>
                <p><strong>Tujuan Budgeting:</strong> ${formData['budget-purpose']}</p>
            </div>
            
            <div class="section page-break">
                ${aiResponseHtml}
            </div>
        </div>
    `;

    document.body.appendChild(pdfContent);

    const canvas = await html2canvas(pdfContent, {
        scale: 2.5,
        useCORS: true,
        scrollY: -window.scrollY,
        windowWidth: pdfContent.scrollWidth,
        windowHeight: pdfContent.scrollHeight
    });

    document.body.removeChild(pdfContent);
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = doc.internal.pageSize.getHeight();

    let y = 0;
    while (y < pdfHeight) {
        doc.addImage(imgData, 'PNG', 0, -y, pdfWidth, pdfHeight);
        y += pageHeight;
        if (y < pdfHeight) doc.addPage();
    }

    doc.save(`Laporan_Keuangan_${formData['biz-name-umkm'].replace(/\s/g, '_')}.pdf`);
}

umkmBudgetingForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    umkmLoadingContainer.style.display = 'flex';
    umkmBudgetingResultContainer.style.display = 'none';

    const formData = {};
    const inputs = umkmBudgetingForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            if (input.checked) {
                formData[input.name] = formData[input.name] ? [...formData[input.name], input.value] : [input.value];
            }
        } else {
            formData[input.id] = input.value;
        }
    });

    const revenueCount = parseInt(formData['revenue-count']);
    const expenseCount = parseInt(formData['expense-count']);

    let totalRevenue = 0;
    let revenueDetails = '';
    for (let i = 1; i <= revenueCount; i++) {
        // BERSIHKAN TITIK DARI INPUT VOLUME DAN HARGA
        const volumeRaw = formData[`rev-volume-${i}`] ? formData[`rev-volume-${i}`].replace(/\./g, '') : '0';
        const volume = parseFloat(volumeRaw) || 0;
        
        const priceRaw = formData[`rev-price-${i}`] ? formData[`rev-price-${i}`].replace(/\./g, '') : '0';
        const price = parseFloat(priceRaw) || 0;
        
        const totalPerStream = volume * price;
        totalRevenue += totalPerStream;
        revenueDetails += `- ${formData[`rev-name-${i}`]} (${formData[`rev-type-${i}`]}): Volume ${volume.toLocaleString('id-ID')} unit, Harga Rp ${price.toLocaleString('id-ID')}, Total Rp ${totalPerStream.toLocaleString('id-ID')}\n`;
    }

    let totalExpense = 0;
    let opexDetails = '';
    let capexDetails = '';
    let hppDetails = '';
    let opexTotal = 0;
    let capexTotal = 0;
    let hppTotal = 0;

    for (let i = 1; i <= expenseCount; i++) {
        // BERSIHKAN TITIK DARI NOMINAL PENGELUARAN
        const nominalRaw = formData[`exp-nominal-${i}`] ? formData[`exp-nominal-${i}`].replace(/\./g, '') : '0';
        const nominal = parseFloat(nominalRaw) || 0;
        
        const type = formData[`exp-type-${i}`];
        totalExpense += nominal;
        
        if (type === 'OPEX') {
            opexDetails += `- ${formData[`exp-name-${i}`]}: Rp ${nominal.toLocaleString('id-ID')}\n`;
            opexTotal += nominal;
        } else if (type === 'CAPEX') {
            capexDetails += `- ${formData[`exp-name-${i}`]}: Rp ${nominal.toLocaleString('id-ID')}\n`;
            capexTotal += nominal;
        } else {
            hppDetails += `- ${formData[`exp-name-${i}`]}: Rp ${nominal.toLocaleString('id-ID')}\n`;
            hppTotal += nominal;
        }
    }
    
    // Ambil Modal Awal (bersihkan titik)
    const modalAwalRaw = formData['biz-capital'] ? formData['biz-capital'].replace(/\./g, '') : '0';
    const modalAwal = parseFloat(modalAwalRaw) || 0;

    // Perhitungan Laporan Keuangan
    const labaKotor = totalRevenue - hppTotal;
    const labaBersih = labaKotor - opexTotal;
    const arusKasOperasi = totalRevenue - opexTotal - hppTotal;
    const arusKasInvestasi = -capexTotal;
    const kasAkhir = (arusKasOperasi + arusKasInvestasi + modalAwal) - totalExpense; // Perhitungan kasar kas akhir

    // Prompt AI
    const prompt = `
    Sebagai seorang konsultan keuangan startup dan akuntan profesional, tolong buatkan laporan keuangan komprehensif untuk bisnis UMKM ini. Berikan laporan yang sangat detail dan sekompleks mungkin, mencakup semua poin yang diminta oleh pengguna. Gunakan format Markdown dan tabel yang rapi.

    **Informasi Budgeting & Bisnis:**
    - Nama Pemilik: ${formData['owner-name']}
    - Profesi: ${formData['owner-profession']}
    - Kota: ${formData['owner-city']}
    - Nama Bisnis: ${formData['biz-name-umkm']}
    - Kategori Bisnis: ${formData['biz-category-umkm']}
    - Deskripsi Bisnis: ${formData['biz-desc-umkm']}
    - Rentang Waktu: ${formData['budget-period']}
    - Tujuan: ${formData['budget-purpose']}
    - Modal Awal: Rp ${modalAwal.toLocaleString('id-ID')}
    
    **1. Proyeksi Sumber Pendapatan**
    ${revenueDetails}
    
    **2. Proyeksi Pengeluaran**
    - **OPEX (Pengeluaran Operasional):**
    ${opexDetails}
    - **CAPEX (Pengeluaran Modal):**
    ${capexDetails}
    - **HPP/COGS (Harga Pokok Penjualan):**
    ${hppDetails}
    
    **3. Laporan Laba Rugi (Proyeksi)**
    Sajikan laporan laba rugi dengan jelas, mencakup: Pendapatan, HPP, Laba Kotor, OPEX, dan Laba Bersih.
    
    **4. Laporan Arus Kas (Proyeksi)**
    Buat laporan arus kas dengan desain ala startup, memuat: Arus Kas dari Operasional, Arus Kas dari Investasi, Arus Kas dari Pendanaan (termasuk modal awal), dan Kas Bersih.
    
    **5. Neraca Keuangan (Proyeksi)**
    Buat laporan neraca dengan desain ala startup, memuat: Aset Lancar, Aset Tetap, Liabilitas (Kewajiban), dan Ekuitas. Pastikan total aset sama dengan total kewajiban ditambah ekuitas.

    **6. Analisis Rasio Keuangan & Metrik Startup**
    Hitung dan jelaskan rasio-rasio berikut dengan detail:
    - **Rasio Profitabilitas:** Gross Profit Margin (Margin Laba Kotor), Net Profit Margin (Margin Laba Bersih).
    - **Rasio Likuiditas:** Current Ratio (Rasio Lancar).
    - **Rasio Solvabilitas:** Debt to Equity Ratio.
    - **Metrik Investasi:** Break-Even Point (BEP) dalam Rupiah dan unit, Payback Period, Net Present Value (NPV), Internal Rate of Return (IRR). Asumsikan biaya modal 10% per tahun.
    
    **7. Saran Keuangan dari AI**
    Berikan saran strategis yang personal dan terperinci berdasarkan semua laporan dan rasio di atas. Saran ini harus mencakup rekomendasi untuk meningkatkan pendapatan, mengelola pengeluaran, mengoptimalkan investasi, dan memperbaiki struktur modal agar bisnis lebih sehat dan menarik bagi investor.
    `;

    try {
      fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        const apiData = await response.json();
        
        if (apiData.candidates && apiData.candidates[0].content) {
            const aiResponse = apiData.candidates[0].content.parts[0].text;
            const formattedResponse = marked.parse(aiResponse);
            
            umkmBudgetingResultContainer.innerHTML = `
                <div class="report-content-umkm">
                    ${formattedResponse}
                </div>
            `;
            umkmBudgetingResultContainer.style.display = 'block';

            setTimeout(() => {
                generateUMKMPDF(formData, umkmBudgetingResultContainer.querySelector('.report-content-umkm').innerHTML);
            }, 2000);

        } else {
            umkmBudgetingResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat membuat laporan. Coba lagi nanti.</p>';
            umkmBudgetingResultContainer.style.display = 'block';
        }
    } catch (err) {
        console.error(err);
        umkmBudgetingResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI. Mohon cek koneksi internet Anda atau coba lagi nanti.</p>';
        umkmBudgetingResultContainer.style.display = 'block';
    } finally {
        umkmLoadingContainer.style.display = 'none';
    }
});
// ===== FITUR PORTOFOLIO INVESTASI OPTIMAL =====
const portfolioForm = document.getElementById('portfolio-form');
const portfolioResultContainer = document.getElementById('portfolio-result');
const portfolioLoadingContainer = document.getElementById('portfolio-loading');

const assetCountInput = document.getElementById('asset-count');
const assetItemContainer = document.getElementById('asset-item-container');
const addAssetBtn = document.getElementById('add-asset-btn');

// Fungsi dinamis untuk menambah/mengubah form aset
// Fungsi dinamis untuk menambah/mengubah form aset dengan format nominal
function manageAssetItems() {
    const newCount = parseInt(assetCountInput.value) || 1;
    const currentCount = assetItemContainer.children.length;

    if (newCount > currentCount) {
        for (let i = currentCount + 1; i <= newCount; i++) {
            const div = document.createElement('div');
            div.classList.add('dynamic-form-group');
            div.innerHTML = `
                <hr>
                <h4>Aset ${i}</h4>
                <div class="form-group">
                    <label for="asset-name-${i}">Nama Aset</label>
                    <input type="text" id="asset-name-${i}" name="asset-name-${i}" required placeholder="Contoh: Saham ABCD, Emas Antam">
                </div>
                <div class="form-group">
                    <label for="asset-type-${i}">Jenis Aset</label>
                    <select id="asset-type-${i}" name="asset-type-${i}" required>
                        <option value="Saham">Saham</option>
                        <option value="Reksadana">Reksadana</option>
                        <option value="Obligasi">Obligasi</option>
                        <option value="Emas">Emas</option>
                        <option value="Properti">Properti</option>
                        <option value="Kripto">Kripto</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="asset-value-${i}">Nilai Investasi Saat Ini (Rp)</label>
                    <input type="text" id="asset-value-${i}" name="asset-value-${i}" class="input-nominal" required placeholder="Contoh: 10.000.000">
                </div>
                <div class="form-group">
                    <label for="asset-return-${i}">Estimasi Return Tahunan (%)</label>
                    <input type="number" id="asset-return-${i}" name="asset-return-${i}" step="0.1" value="0" placeholder="Contoh: 8">
                </div>
            `;
            assetItemContainer.appendChild(div);
            
            // PENTING: Pasang formatter ke input baru
            const newInput = div.querySelector('.input-nominal');
            attachNominalFormatter(newInput); // Pastikan fungsi attachNominalFormatter sudah ada (lihat jawaban sebelumnya)
        }
    } else if (newCount < currentCount) {
        for (let i = currentCount; i > newCount; i--) {
            assetItemContainer.lastElementChild.remove();
        }
    }
}

// Event listener untuk tombol dan input count
assetCountInput.addEventListener('input', manageAssetItems);
addAssetBtn.addEventListener('click', () => {
    assetCountInput.value = (parseInt(assetCountInput.value) || 0) + 1;
    manageAssetItems();
});

// Inisialisasi awal form
document.addEventListener('DOMContentLoaded', () => {
    manageAssetItems();
});

// Fungsi untuk membuat dan mengunduh PDF
// Fungsi untuk membuat dan mengunduh PDF Portofolio (REVISI RAPI)
async function generatePortfolioPDF(formData, aiResponseHtml) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    const pdfContent = document.createElement('div');
    pdfContent.setAttribute('id', 'pdf-temp-portfolio-container');
    
    // Setting lebar dan padding agar pas di A4
    pdfContent.style.width = '750px'; 
    pdfContent.style.padding = '40px';
    pdfContent.style.backgroundColor = '#ffffff';

    // CSS Khusus agar teks RAPI dan tidak berdempetan
    pdfContent.innerHTML = `
        <style>
            body, html { 
                margin: 0; padding: 0; 
                font-family: Helvetica, Arial, sans-serif; /* Font standar agar render aman */
                box-sizing: border-box; 
            }
            h1 { 
                font-size: 26px; 
                text-align: center; 
                color: #4A55A2; 
                border-bottom: 3px solid #4A55A2; 
                padding-bottom: 15px; 
                margin-bottom: 30px; 
                letter-spacing: 1px;
            }
            h2 { 
                font-size: 20px; 
                color: #2B3A67; 
                margin-top: 30px; 
                margin-bottom: 15px; 
                border-left: 5px solid #F6AD55; 
                padding-left: 10px;
                letter-spacing: 0.5px;
            }
            h3 { 
                font-size: 16px; 
                color: #4A55A2; 
                margin-top: 20px; 
                margin-bottom: 10px; 
                font-weight: bold;
            }
            /* PERBAIKAN UTAMA: Spasi dan Line Height */
            p, li { 
                font-size: 14px; 
                line-height: 1.8; /* Jarak antar baris diperlebar */
                color: #333; 
                margin-bottom: 12px; 
                letter-spacing: 0.3px; /* Mencegah huruf menempel */
                text-align: justify; /* Rata kanan kiri */
            }
            ul, ol {
                margin-bottom: 15px;
                padding-left: 20px;
            }
            li {
                margin-bottom: 8px;
            }
            strong {
                color: #2B3A67;
                font-weight: 700;
            }
            .section { 
                padding: 25px; 
                background-color: #F8FAFC; 
                border-radius: 12px; 
                margin-bottom: 25px; 
                border: 1px solid #E2E8F0;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            .page-break { page-break-before: always; }
        </style>
        
        <div>
            <h1>Laporan Portofolio Investasi Optimal</h1>
            
            <div class="section">
                <h2>Profil Investor</h2>
                <div class="info-grid">
                    <p><strong>Nama:</strong> ${formData['investor-name']}</p>
                    <p><strong>Usia:</strong> ${formData['investor-age']} tahun</p>
                    <p><strong>Profesi:</strong> ${formData['investor-profession']}</p>
                    <p><strong>Profil Risiko:</strong> ${formData['risk-profile']}</p>
                    <p><strong>Jangka Waktu:</strong> ${formData['investment-horizon']}</p>
                </div>
                <p style="margin-top: 10px;"><strong>Tujuan Investasi:</strong><br> ${formData['investment-goal']}</p>
            </div>
            
            <div class="section">
                 ${aiResponseHtml}
            </div>
            
            <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #888;">
                <p>Dibuat otomatis oleh AI Ruang Finansial. <br>Harap konsultasikan kembali dengan penasihat keuangan profesional.</p>
            </div>
        </div>
    `;

    document.body.appendChild(pdfContent);

    // Hapus elemen video jika ada (untuk mencegah error html2canvas)
    document.querySelectorAll("video").forEach(v => v.style.display = 'none');

    // Render dengan skala lebih tinggi untuk ketajaman teks
    const canvas = await html2canvas(pdfContent, {
        scale: 2, 
        useCORS: true,
        scrollY: -window.scrollY,
        windowWidth: pdfContent.scrollWidth,
        windowHeight: pdfContent.scrollHeight
    });

    document.body.removeChild(pdfContent);
    // Kembalikan video
    document.querySelectorAll("video").forEach(v => v.style.display = 'block');

    const imgData = canvas.toDataURL('image/jpeg', 1.0); // Gunakan JPEG kualitas tinggi
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // Logika multi-halaman
    const pageHeight = doc.internal.pageSize.getHeight();
    let heightLeft = pdfHeight;
    let position = 0;

    doc.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        doc.addPage();
        doc.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
    }

    doc.save(`Laporan_Portofolio_${formData['investor-name'].replace(/\s/g, '_')}.pdf`);
}

// ===== EVENT LISTENER PORTOFOLIO (REVISI) =====
portfolioForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    portfolioLoadingContainer.style.display = 'flex';
    portfolioResultContainer.style.display = 'none';

    const formData = {};
    const inputs = portfolioForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        formData[input.id] = input.value;
    });

    const assetCount = parseInt(formData['asset-count']);
    const assets = [];
    let totalPortfolioValue = 0;

    for (let i = 1; i <= assetCount; i++) {
        // Cek jika elemen ada (untuk menghindari error jika user mengurangi jumlah aset tapi form belum refresh)
        if (document.getElementById(`asset-name-${i}`)) {
            const assetName = formData[`asset-name-${i}`];
            const assetType = formData[`asset-type-${i}`];
            // Bersihkan format titik untuk kalkulasi
            const assetValue = parseFloat(formData[`asset-value-${i}`].replace(/\./g, '')) || 0;
            const assetReturn = parseFloat(formData[`asset-return-${i}`]) || 0;
            
            assets.push({ name: assetName, type: assetType, value: assetValue, return: assetReturn });
            totalPortfolioValue += assetValue;
        }
    }

    // Ambil kontribusi bulanan (bersihkan titik)
    const monthlyContributionRaw = formData['monthly-contribution-invest'].replace(/\./g, '') || '0';
    const monthlyContribution = parseFloat(monthlyContributionRaw);

    // Format data aset untuk prompt
    let assetDetails = '';
    assets.forEach(asset => {
        assetDetails += `- ${asset.name} (${asset.type}): Rp ${asset.value.toLocaleString('id-ID')} (Estimasi Return: ${asset.return}%) \n`;
    });

    // Prompt yang diperbaiki agar output AI lebih rapi untuk PDF
    const prompt = `
    Bertindaklah sebagai Manajer Investasi Profesional. Buat laporan analisis portofolio yang sangat rapi, formal, dan terstruktur untuk klien berikut.
    
    **Data Klien:**
    - Nama: ${formData['investor-name']}
    - Profil Risiko: ${formData['risk-profile']}
    - Tujuan: ${formData['investment-goal']}
    - Jangka Waktu: ${formData['investment-horizon']}
    
    **Portofolio Saat Ini:**
    - Total Nilai: Rp ${totalPortfolioValue.toLocaleString('id-ID')}
    - Aset:
    ${assetDetails}
    - Rencana Tambahan: Investasi rutin Rp ${monthlyContribution.toLocaleString('id-ID')}/bulan.

    **Instruksi Format Output (PENTING):**
    1. Gunakan format Markdown standar.
    2. Gunakan paragraf yang pendek-pendek (maksimal 3-4 baris per paragraf) agar mudah dibaca.
    3. Gunakan poin-poin (bullet points) untuk rincian strategi.
    4. Jangan gunakan tabel kompleks, gunakan daftar saja.
    
    **Isi Laporan:**
    1. **Analisis Kesehatan Portofolio**: Apakah alokasi aset saat ini sudah sesuai dengan profil risiko ${formData['risk-profile']}? Jelaskan kelebihan dan kekurangannya.
    2. **Proyeksi Masa Depan**: Perkiraan nilai portofolio di masa depan jika rutin menabung Rp ${monthlyContribution.toLocaleString('id-ID')} dengan asumsi return rata-rata portofolio ini.
    3. **Rekomendasi Rebalancing (Aksi Nyata)**:
       - Aset apa yang perlu ditambah?
       - Aset apa yang perlu dikurangi?
       - Instrumen apa yang direkomendasikan untuk dibeli sekarang?
    4. **Strategi Manajemen Risiko**: Cara melindungi nilai aset dari inflasi dan fluktuasi pasar.
    `;

    try {
       fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        const apiData = await response.json();

        if (apiData.candidates && apiData.candidates[0].content) {
            const aiResponse = apiData.candidates[0].content.parts[0].text;
            const formattedResponse = marked.parse(aiResponse);

            portfolioResultContainer.innerHTML = `
                <div class="report-content-umkm">
                    ${formattedResponse}
                </div>
            `;
            portfolioResultContainer.style.display = 'block';

            // Generate PDF dengan delay sedikit agar DOM siap
            setTimeout(() => {
                generatePortfolioPDF(formData, portfolioResultContainer.querySelector('.report-content-umkm').innerHTML);
            }, 1000);

        } else {
            portfolioResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat membuat laporan. Coba lagi nanti.</p>';
            portfolioResultContainer.style.display = 'block';
        }
    } catch (err) {
        console.error(err);
        portfolioResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI. Mohon cek koneksi internet Anda atau coba lagi nanti.</p>';
        portfolioResultContainer.style.display = 'block';
    } finally {
        portfolioLoadingContainer.style.display = 'none';
    }
});

// ===== FITUR LAPORAN KEUANGAN KEBERLANJUTAN INSTAN (VERSI LENGKAP) =====
const sustainabilityForm = document.getElementById('sustainability-form');
const sustainabilityResultContainer = document.getElementById('sustainability-result');
const sustainabilityLoadingContainer = document.getElementById('sustainability-loading');

// Fungsi untuk membuat dan mengunduh PDF
async function generateSustainabilityPDF(formData, aiResponseHtml) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    const pdfContent = document.createElement('div');
    pdfContent.setAttribute('id', 'pdf-temp-sustain-container');
    pdfContent.style.width = '794px'; 
    pdfContent.style.padding = '40px';
    pdfContent.innerHTML = `
        <style>
            body, html { margin: 0; padding: 0; font-family: 'Poppins', sans-serif; box-sizing: border-box; }
            h1 { font-size: 28px; text-align: center; color: #4A55A2; border-bottom: 3px solid #4A55A2; padding-bottom: 15px; margin: 0 0 25px 0; }
            h2 { font-size: 22px; color: #2B3A67; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #E2E8F0; padding-bottom: 5px; }
            h3 { font-size: 18px; color: #4A55A2; margin-top: 20px; margin-bottom: 10px; }
            p, li { font-size: 14px; line-height: 1.6; color: #4A55A2; }
            .section { padding: 20px; background-color: #F7FAFC; border-radius: 10px; margin-bottom: 20px; }
            .page-break { page-break-before: always; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #E2E8F0; padding: 10px; text-align: left; }
            th { background-color: #EDF2F7; font-weight: 600; color: #2B3A67; }
        </style>
        <div style="padding: 20px;">
            <h1>Laporan Keuangan Keberlanjutan</h1>
            <div class="section">
                <h2>Ringkasan Bisnis</h2>
                <p><strong>Nama Bisnis:</strong> ${formData['sustain-biz-name']}</p>
                <p><strong>Nama Pemilik:</strong> ${formData['sustain-biz-owner']}</p>
                <p><strong>Industri:</strong> ${formData['sustain-biz-industry']}</p>
                <p><strong>Periode Laporan:</strong> ${formData['sustain-report-period']}</p>
            </div>
            
            <div class="section page-break">
                ${aiResponseHtml}
            </div>
        </div>
    `;

    document.body.appendChild(pdfContent);

    const canvas = await html2canvas(pdfContent, {
        scale: 2.5,
        useCORS: true,
        scrollY: -window.scrollY,
        windowWidth: pdfContent.scrollWidth,
        windowHeight: pdfContent.scrollHeight
    });

    document.body.removeChild(pdfContent);
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = doc.internal.pageSize.getHeight();

    let y = 0;
    while (y < pdfHeight) {
        doc.addImage(imgData, 'PNG', 0, -y, pdfWidth, pdfHeight);
        y += pageHeight;
        if (y < pdfHeight) doc.addPage();
    }

    doc.save(`Laporan_Keberlanjutan_${formData['sustain-biz-name'].replace(/\s/g, '_')}.pdf`);
}


sustainabilityForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    sustainabilityLoadingContainer.style.display = 'flex';
    sustainabilityResultContainer.style.display = 'none';

    const formData = {};
    const inputs = sustainabilityForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        formData[input.id] = input.value;
    });

    // --- BERSIHKAN INPUT NOMINAL ---
    const totalRevenue = parseFloat(formData['sustain-revenue'].replace(/\./g, '')) || 0;
    const totalOpex = parseFloat(formData['sustain-opex'].replace(/\./g, '')) || 0;
    const netProfit = totalRevenue - totalOpex;

    const communityBudget = parseFloat(formData['sustain-community-engagement'].replace(/\./g, '')) || 0;
    const marketingBudget = parseFloat(formData['sustain-marketing-budget'].replace(/\./g, '')) || 0;
    const csrInvestment = parseFloat(formData['sustain-csr-investment'].replace(/\./g, '')) || 0;
    const greenLoan = parseFloat(formData['sustain-green-loan'].replace(/\./g, '')) || 0;
    const capitalExpenditure = parseFloat(formData['sustain-capital-expenditure'].replace(/\./g, '')) || 0;
    const innovationBudget = parseFloat(formData['sustain-innovation-budget'].replace(/\./g, '')) || 0;

    // Ambil data non-uang
    const energyKwh = parseFloat(formData['sustain-energy-kwh']) || 0;
    const wasteKg = parseFloat(formData['sustain-waste-kg']) || 0;
    const ecoFriendlyPercent = parseFloat(formData['sustain-eco-friendly-percent']) || 0;
    const employeeCount = parseFloat(formData['sustain-biz-employees']) || 1;
    const employeeTrainingHours = parseFloat(formData['sustain-employee-training']) || 0;
    const prActivity = formData['sustain-pr-activity'];
    const greenCapexPercent = parseFloat(formData['sustain-green-capex-percent']) || 0;
    const riskMitigation = formData['sustain-risk-mitigation'];
    const certification = formData['sustain-certification'];

    // Perhitungan metrik dasar
    const co2Emissions = energyKwh * 0.495;
    const wastePerEmployee = wasteKg / employeeCount;
    const trainingPerEmployee = employeeTrainingHours / employeeCount;
    const greenCapexValue = capitalExpenditure * (greenCapexPercent / 100);

    // Prompt yang sangat detail untuk AI
    const prompt = `
    Sebagai seorang konsultan keberlanjutan (ESG), buatkan laporan keuangan keberlanjutan yang komprehensif untuk bisnis ini. Sajikan laporan dalam format Markdown yang rapi dan elegan, mencakup semua poin yang diminta.

    **Informasi Bisnis:**
    - Nama Bisnis: ${formData['sustain-biz-name']}
    - Pemilik: ${formData['sustain-biz-owner']}
    - Industri: ${formData['sustain-biz-industry']}
    - Karyawan: ${employeeCount} orang
    - Periode: ${formData['sustain-report-period']}
    
    **1. Analisis Dampak Lingkungan (E)**
    - **Metrik Utama:**
        - Emisi Karbon: ${co2Emissions.toLocaleString('id-ID', { maximumFractionDigits: 2 })} kg CO2e
        - Limbah per Karyawan: ${wastePerEmployee.toLocaleString('id-ID', { maximumFractionDigits: 2 })} kg
        - Persentase Bahan Ramah Lingkungan: ${ecoFriendlyPercent}%
    - Berikan analisis mendalam tentang jejak lingkungan bisnis ini. Bandingkan dengan standar industri dan berikan saran spesifik untuk mengurangi emisi, limbah, dan mengoptimalkan penggunaan sumber daya.

    **2. Analisis Dampak Sosial (S)**
    - **Metrik Utama:**
        - Jam Pelatihan per Karyawan: ${trainingPerEmployee.toLocaleString('id-ID', { maximumFractionDigits: 2 })} jam
        - Anggaran Komunitas: Rp ${communityBudget.toLocaleString('id-ID')}
        - Kebijakan Pemasok Lokal: ${formData['sustain-supplier-policy']}
    - Analisis bagaimana bisnis ini memberikan dampak positif bagi karyawan dan komunitasnya. Berikan saran untuk meningkatkan kesejahteraan karyawan dan memperkuat hubungan dengan masyarakat lokal.

    **3. Analisis Tata Kelola (G) & Keuangan**
    - **Metrik Utama:**
        - Laba Bersih: Rp ${netProfit.toLocaleString('id-ID')}
        - Kode Etik Tertulis: ${formData['sustain-business-ethic']}
        - Anggaran Pemasaran: Rp ${marketingBudget.toLocaleString('id-ID')}
        - Investasi CSR: Rp ${csrInvestment.toLocaleString('id-ID')}
        - Aktivitas PR: ${prActivity || 'Tidak ada'}
        - Pinjaman Hijau: Rp ${greenLoan.toLocaleString('id-ID')}
        - CAPEX Berkelanjutan: Rp ${greenCapexValue.toLocaleString('id-ID')} (${greenCapexPercent}%)
        - Anggaran R&D: Rp ${innovationBudget.toLocaleString('id-ID')}
        - Strategi Mitigasi Risiko: ${riskMitigation || 'Tidak ada'}
        - Sertifikasi: ${certification || 'Tidak ada'}
    - Berikan analisis tentang transparansi dan etika bisnis. Jelaskan korelasi antara kinerja finansial (${netProfit > 0 ? 'laba' : 'rugi'}) dengan praktik keberlanjutan yang ada. Berikan saran untuk perbaikan tata kelola.

    **4. Ringkasan & Saran Strategis AI**
    Rangkum hasil analisis ESG di atas dan berikan setidaknya 5 poin saran strategis yang praktis dan terperinci. Fokus pada bagaimana bisnis dapat mengintegrasikan praktik keberlanjutan ke dalam operasional sehari-hari untuk meningkatkan reputasi, menarik investor, dan bahkan meningkatkan profitabilitas jangka panjang. Gunakan bahasa yang memotivasi dan inspiratif.
    `;

    try {
       fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        const apiData = await response.json();

        if (apiData.candidates && apiData.candidates[0].content) {
            const aiResponse = apiData.candidates[0].content.parts[0].text;
            const formattedResponse = marked.parse(aiResponse);
            
            sustainabilityResultContainer.innerHTML = `
                <div class="report-content-umkm">
                    ${formattedResponse}
                </div>
            `;
            sustainabilityResultContainer.style.display = 'block';

            setTimeout(() => {
                generateSustainabilityPDF(formData, sustainabilityResultContainer.querySelector('.report-content-umkm').innerHTML);
            }, 2000);

        } else {
            sustainabilityResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat membuat laporan. Coba lagi nanti.</p>';
            sustainabilityResultContainer.style.display = 'block';
        }
    } catch (err) {
        console.error(err);
        sustainabilityResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI. Mohon cek koneksi internet Anda atau coba lagi nanti.</p>';
        sustainabilityResultContainer.style.display = 'block';
    } finally {
        sustainabilityLoadingContainer.style.display = 'none';
    }
});
// ===== FITUR CREATE YOUR BUSINESS =====
const businessPlanForm = document.getElementById('business-plan-form');
const businessPlanResultContainer = document.getElementById('business-plan-result');
const businessPlanLoadingContainer = document.getElementById('business-plan-loading');

// Fungsi untuk membuat dan mengunduh PDF
async function generateBusinessPlanPDF(formData, aiResponseHtml) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    const pdfContent = document.createElement('div');
    pdfContent.setAttribute('id', 'pdf-temp-business-plan-container');
    pdfContent.style.width = '794px'; 
    pdfContent.style.padding = '40px';
    pdfContent.innerHTML = `
        <style>
            body, html { margin: 0; padding: 0; font-family: 'Poppins', sans-serif; box-sizing: border-box; }
            h1 { font-size: 28px; text-align: center; color: #4A55A2; border-bottom: 3px solid #4A55A2; padding-bottom: 15px; margin: 0 0 25px 0; }
            h2 { font-size: 22px; color: #2B3A67; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #E2E8F0; padding-bottom: 5px; }
            h3 { font-size: 18px; color: #4A55A2; margin-top: 20px; margin-bottom: 10px; }
            p, li { font-size: 14px; line-height: 1.6; color: #4A55A2; }
            .section { padding: 20px; background-color: #F7FAFC; border-radius: 10px; margin-bottom: 20px; }
            .page-break { page-break-before: always; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #E2E8F0; padding: 10px; text-align: left; }
            th { background-color: #EDF2F7; font-weight: 600; color: #2B3A67; }
        </style>
        <div style="padding: 20px;">
            <h1>Rencana Bisnis</h1>
            <div class="section">
                <h2>Informasi Dasar</h2>
                <p><strong>Nama Pengguna:</strong> ${formData['user-name']}</p>
                <p><strong>Ide Bisnis:</strong> ${formData['business-idea-desc']}</p>
                <p><strong>Kategori:</strong> ${formData['business-category']}</p>
                <p><strong>Bidang:</strong> ${formData['business-field']}</p>
                <p><strong>Area Geografis:</strong> ${formData['geographical-area']}</p>
            </div>
            
            <div class="section page-break">
                ${aiResponseHtml}
            </div>
        </div>
    `;

    document.body.appendChild(pdfContent);

    const canvas = await html2canvas(pdfContent, {
        scale: 2.5,
        useCORS: true,
        scrollY: -window.scrollY,
        windowWidth: pdfContent.scrollWidth,
        windowHeight: pdfContent.scrollHeight
    });

    document.body.removeChild(pdfContent);
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = doc.internal.pageSize.getHeight();

    let y = 0;
    while (y < pdfHeight) {
        doc.addImage(imgData, 'PNG', 0, -y, pdfWidth, pdfHeight);
        y += pageHeight;
        if (y < pdfHeight) doc.addPage();
    }

    doc.save(`Rencana_Bisnis_${formData['user-name'].replace(/\s/g, '_')}.pdf`);
}

businessPlanForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    businessPlanLoadingContainer.style.display = 'flex';
    businessPlanResultContainer.style.display = 'none';

    const formData = {};
    const inputs = businessPlanForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        formData[input.id] = input.value;
    });

    // Prompt yang sangat detail untuk AI
    const prompt = `
    Sebagai seorang konsultan bisnis profesional, buatkan business plan yang komprehensif dan ringkas berdasarkan data berikut. Sajikan laporan dalam format Markdown yang rapi dan elegan.

    **Informasi Dasar:**
    - Nama Pengguna: ${formData['user-name']}
    - Kategori Bisnis: ${formData['business-category']}
    - Bidang Bisnis: ${formData['business-field']}
    - Area Geografis: ${formData['geographical-area']}
    - Deskripsi Ide Bisnis: ${formData['business-idea-desc']}

    **1. Nama & Deskripsi Perusahaan**
    - **Nama Bisnis:** Berikan 3-5 nama bisnis yang unik dan menarik, sesuai dengan ide yang diberikan. Pilih satu yang paling cocok.
    - **Deskripsi Bisnis:** Jelaskan secara ringkas tentang bisnis, visi, misi, dan nilai-nilai inti perusahaan.
    - **Manfaat & Keuntungan:** Jelaskan manfaat dan keuntungan produk atau jasa yang ditawarkan kepada pelanggan.

    **2. Produk & Layanan**
    - **Deskripsi Produk/Layanan:** Jelaskan produk atau layanan secara rinci, termasuk fitur-fitur utamanya.
    
    **3. Strategi Pemasaran**
    - **Target Pasar:** Tentukan target pasar yang spesifik dan segmented.
    - **Strategi Pemasaran:** Rencanakan strategi pemasaran untuk menjangkau target pasar, baik secara digital maupun tradisional.
    
    **4. Perencanaan Keuangan (Budgeting)**
    - **Proyeksi Keuangan:** Berikan gambaran umum budgeting, termasuk proyeksi pendapatan dan pengeluaran awal (modal kerja).
    - **Strategi Monetisasi:** Jelaskan cara bisnis menghasilkan uang.

    **5. Strategi Operasional**
    - **Model Operasi:** Rencanakan alur operasional bisnis, dari produksi hingga pengiriman.
    - **Kemitraan:** Identifikasi potensi kemitraan strategis.

    **6. Strategi Sumber Daya Manusia (SDM)**
    - **Struktur Tim:** Rancang struktur tim yang ideal untuk menjalankan bisnis.
    - **Kebutuhan SDM:** Sebutkan peran dan tanggung jawab kunci yang dibutuhkan.

    **7. Analisis SWOT**
    Buat analisis SWOT (Strength, Weakness, Opportunity, Threat) yang relevan dan terperinci.

    **8. Peringatan & Disclaimer**
    Berikan peringatan bahwa ini adalah rencana bisnis instan, dan penting untuk melakukan riset pasar lebih lanjut dan konsultasi dengan ahli.
    `;

    try {
        fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        const apiData = await response.json();

        if (apiData.candidates && apiData.candidates[0].content) {
            const aiResponse = apiData.candidates[0].content.parts[0].text;
            const formattedResponse = marked.parse(aiResponse);
            
            businessPlanResultContainer.innerHTML = `
                <div class="report-content-umkm">
                    ${formattedResponse}
                </div>
            `;
            businessPlanResultContainer.style.display = 'block';

            setTimeout(() => {
                generateBusinessPlanPDF(formData, businessPlanResultContainer.querySelector('.report-content-umkm').innerHTML);
            }, 2000);

        } else {
            businessPlanResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat membuat laporan. Coba lagi nanti.</p>';
            businessPlanResultContainer.style.display = 'block';
        }
    } catch (err) {
        console.error(err);
        businessPlanResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI. Mohon cek koneksi internet Anda atau coba lagi nanti.</p>';
        businessPlanResultContainer.style.display = 'block';
    } finally {
        businessPlanLoadingContainer.style.display = 'none';
    }
});
// ===== FITUR SOLVE YOUR BUSINESS =====
const businessProblemForm = document.getElementById('business-problem-form');
const solveResultContainer = document.getElementById('solve-result');
const solveLoadingContainer = document.getElementById('solve-loading');

// Fungsi untuk membuat dan mengunduh PDF
async function generateProblemSolvingPDF(formData, aiResponseHtml) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    const pdfContent = document.createElement('div');
    pdfContent.setAttribute('id', 'pdf-temp-problem-container');
    pdfContent.style.width = '794px';
    pdfContent.style.padding = '40px';
    pdfContent.innerHTML = `
        <style>
            body, html { margin: 0; padding: 0; font-family: 'Poppins', sans-serif; box-sizing: border-box; }
            h1 { font-size: 28px; text-align: center; color: #4A55A2; border-bottom: 3px solid #4A55A2; padding-bottom: 15px; margin: 0 0 25px 0; }
            h2 { font-size: 22px; color: #2B3A67; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #E2E8F0; padding-bottom: 5px; }
            h3 { font-size: 18px; color: #4A55A2; margin-top: 20px; margin-bottom: 10px; }
            p, li { font-size: 14px; line-height: 1.6; color: #4A55A2; }
            .section { padding: 20px; background-color: #F7FAFC; border-radius: 10px; margin-bottom: 20px; }
            .page-break { page-break-before: always; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #E2E8F0; padding: 10px; text-align: left; }
            th { background-color: #EDF2F7; font-weight: 600; color: #2B3A67; }
        </style>
        <div style="padding: 20px;">
            <h1>Laporan Analisis & Solusi Bisnis</h1>
            <div class="section">
                <h2>Informasi Dasar</h2>
                <p><strong>Nama Pemilik:</strong> ${formData['problem-solver-name']}</p>
                <p><strong>Nama Bisnis:</strong> ${formData['business-name-problem']}</p>
                <p><strong>Deskripsi Bisnis:</strong> ${formData['business-desc-problem']}</p>
                <p><strong>Kategori Masalah:</strong> ${formData['problem-category']}</p>
            </div>
            
            <div class="section page-break">
                ${aiResponseHtml}
            </div>
        </div>
    `;

    document.body.appendChild(pdfContent);

    const canvas = await html2canvas(pdfContent, {
        scale: 2.5,
        useCORS: true,
        scrollY: -window.scrollY,
        windowWidth: pdfContent.scrollWidth,
        windowHeight: pdfContent.scrollHeight
    });

    document.body.removeChild(pdfContent);
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = doc.internal.pageSize.getHeight();

    let y = 0;
    while (y < pdfHeight) {
        doc.addImage(imgData, 'PNG', 0, -y, pdfWidth, pdfHeight);
        y += pageHeight;
        if (y < pdfHeight) doc.addPage();
    }

    doc.save(`Solusi_Bisnis_${formData['business-name-problem'].replace(/\s/g, '_')}.pdf`);
}

businessProblemForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    solveLoadingContainer.style.display = 'flex';
    solveResultContainer.style.display = 'none';

    const formData = {};
    const inputs = businessProblemForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        formData[input.id] = input.value;
    });

    // Prompt yang sangat detail untuk AI
    const prompt = `
    Anda adalah seorang konsultan bisnis profesional yang ahli dalam memecahkan masalah. Tugas Anda adalah memberikan analisis mendalam dan solusi terstruktur untuk masalah bisnis berikut.

    **Informasi Bisnis:**
    - Nama Pemilik: ${formData['problem-solver-name']}
    - Nama Bisnis: ${formData['business-name-problem']}
    - Deskripsi Bisnis: ${formData['business-desc-problem']}
    - Kategori Bisnis: ${formData['business-category-problem']}
    - Bidang Bisnis: ${formData['business-field-problem']}
    - Area Geografis: ${formData['geographical-area-problem']}
    - Kategori Masalah Bisnis: ${formData['problem-category']}
    - Masalah Bisnis: ${formData['problem-description']}

    **1. Analisis Masalah Bisnis**
    Lakukan analisis masalah dengan kerangka kerja berikut. Sajikan dalam format yang mudah dibaca dengan poin-poin.
    - **SCQA (Situation, Complication, Question, Answer):** Identifikasi situasi saat ini, komplikasi yang muncul, pertanyaan kunci, dan jawaban singkat.
    - **Gap Analysis:** Identifikasi perbedaan antara kondisi bisnis saat ini dan kondisi yang diinginkan, serta penyebabnya.
    - **Issue Tree:** Buat pohon isu untuk memecah masalah besar menjadi komponen-komponen yang lebih kecil dan terukur.
    - **RCA (Root Cause Analysis):** Tentukan akar masalah utama dari semua isu yang telah diidentifikasi.
    - **Hypothesis:** Rumuskan hipotesis tentang solusi yang paling mungkin berhasil.

    **2. Strategi & Solusi Bisnis**
    Berdasarkan analisis di atas, berikan 3-5 strategi atau solusi bisnis yang konkret dan terperinci. Jelaskan langkah-langkah implementasi untuk setiap solusi.

    **3. Kesimpulan & Saran Akhir**
    Berikan kesimpulan akhir tentang masalah dan solusi yang disarankan. Akhiri dengan saran praktis dan motivasi untuk pemilik bisnis.
    `;

    try {
        fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        const apiData = await response.json();

        if (apiData.candidates && apiData.candidates[0].content) {
            const aiResponse = apiData.candidates[0].content.parts[0].text;
            const formattedResponse = marked.parse(aiResponse);
            
            solveResultContainer.innerHTML = `
                <div class="report-content-umkm">
                    ${formattedResponse}
                </div>
            `;
            solveResultContainer.style.display = 'block';

            setTimeout(() => {
                generateProblemSolvingPDF(formData, solveResultContainer.querySelector('.report-content-umkm').innerHTML);
            }, 2000);

        } else {
            solveResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat membuat laporan. Coba lagi nanti.</p>';
            solveResultContainer.style.display = 'block';
        }
    } catch (err) {
        console.error(err);
        solveResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI. Mohon cek koneksi internet Anda atau coba lagi nanti.</p>';
        solveResultContainer.style.display = 'block';
    } finally {
        solveLoadingContainer.style.display = 'none';
    }
});
// ===== FITUR CREATE YOUR STRATEGY =====
const strategyForm = document.getElementById('strategy-form');
const strategyResultContainer = document.getElementById('strategy-result');
const strategyLoadingContainer = document.getElementById('strategy-loading');

// Fungsi untuk membuat dan mengunduh PDF
async function generateStrategyPDF(formData, aiResponseHtml) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    const pdfContent = document.createElement('div');
    pdfContent.setAttribute('id', 'pdf-temp-strategy-container');
    pdfContent.style.width = '794px';
    pdfContent.style.padding = '40px';
    pdfContent.innerHTML = `
        <style>
            body, html { margin: 0; padding: 0; font-family: 'Poppins', sans-serif; box-sizing: border-box; }
            h1 { font-size: 28px; text-align: center; color: #4A55A2; border-bottom: 3px solid #4A55A2; padding-bottom: 15px; margin: 0 0 25px 0; }
            h2 { font-size: 22px; color: #2B3A67; margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #E2E8F0; padding-bottom: 5px; }
            h3 { font-size: 18px; color: #4A55A2; margin-top: 20px; margin-bottom: 10px; }
            p, li { font-size: 14px; line-height: 1.6; color: #4A55A2; }
            .section { padding: 20px; background-color: #F7FAFC; border-radius: 10px; margin-bottom: 20px; }
            .page-break { page-break-before: always; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #E2E8F0; padding: 10px; text-align: left; }
            th { background-color: #EDF2F7; font-weight: 600; color: #2B3A67; }
        </style>
        <div style="padding: 20px;">
            <h1>Rencana Strategi Bisnis</h1>
            <div class="section">
                <h2>Informasi Dasar</h2>
                <p><strong>Nama Pemilik:</strong> ${formData['strategy-user-name']}</p>
                <p><strong>Nama Bisnis:</strong> ${formData['strategy-business-name']}</p>
                <p><strong>Tujuan Strategi:</strong> ${formData['strategy-purpose']}</p>
                <p><strong>Kategori Strategi:</strong> ${formData['strategy-category']}</p>
            </div>
            
            <div class="section page-break">
                ${aiResponseHtml}
            </div>
        </div>
    `;

    document.body.appendChild(pdfContent);

    const canvas = await html2canvas(pdfContent, {
        scale: 2.5,
        useCORS: true,
        scrollY: -window.scrollY,
        windowWidth: pdfContent.scrollWidth,
        windowHeight: pdfContent.scrollHeight
    });

    document.body.removeChild(pdfContent);
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = doc.internal.pageSize.getHeight();

    let y = 0;
    while (y < pdfHeight) {
        doc.addImage(imgData, 'PNG', 0, -y, pdfWidth, pdfHeight);
        y += pageHeight;
        if (y < pdfHeight) doc.addPage();
    }

    doc.save(`Strategi_Bisnis_${formData['strategy-business-name'].replace(/\s/g, '_')}.pdf`);
}

strategyForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    strategyLoadingContainer.style.display = 'flex';
    strategyResultContainer.style.display = 'none';

    const formData = {};
    const inputs = strategyForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        formData[input.id] = input.value;
    });

    // Prompt yang sangat detail untuk AI
    const prompt = `
    Anda adalah seorang konsultan bisnis yang ahli dalam merumuskan strategi kompetitif. Tugas Anda adalah membuat dokumen strategi bisnis yang komprehensif untuk bisnis berikut.

    **Informasi Bisnis:**
    - Nama Pemilik: ${formData['strategy-user-name']}
    - Nama Bisnis: ${formData['strategy-business-name']}
    - Deskripsi Bisnis: ${formData['strategy-business-desc']}
    - Kategori Bisnis: ${formData['strategy-business-category']}
    - Bidang Bisnis: ${formData['strategy-business-field']}
    - Area Geografis: ${formData['strategy-geographical-area']}
    - Tujuan Strategi: ${formData['strategy-purpose']}
    - Kategori Strategi yang Diinginkan: ${formData['strategy-category']}

    **1. Analisis Situasi & Visi Strategi**
    - **Nama Strategi:** Berikan nama yang unik dan menarik untuk strategi ini.
    - **Konsep Strategi Bisnis:** Jelaskan konsep utama di balik strategi yang dirumuskan, mengacu pada tujuan bisnis.

    **2. Sub-Strategi & Rencana Aksi (5W+1H)**
    - Berikan 3-5 sub-strategi yang relevan dengan kategori yang dipilih.
    - Untuk setiap sub-strategi, jelaskan rencana aksi menggunakan framework 5W+1H (What, Who, When, Where, Why, How).
    - Contoh format:
      * **Sub-Strategi:** [Nama Sub-Strategi]
      * **What:** Apa yang akan dilakukan?
      * **Who:** Siapa yang bertanggung jawab?
      * **When:** Kapan akan dimulai?
      * **Where:** Di mana akan diimplementasikan?
      * **Why:** Mengapa strategi ini penting?
      * **How:** Bagaimana cara melaksanakannya?

    **3. Stakeholder & Management Risiko**
    - **Stakeholder Strategi:** Identifikasi stakeholder utama yang akan terpengaruh atau terlibat dalam strategi ini dan jelaskan peran mereka.
    - **Management Risk Strategy:** Buat tabel untuk mengidentifikasi potensi risiko, dampaknya, dan langkah-langkah mitigasi.
      - Potential Risk
      - Impact (Low, Medium, High)
      - Mitigation
      - Control & Improvement

    **4. Skenario & Exit Strategy**
    - **Worst & Best Scenario Strategy:** Gambarkan skenario terburuk dan terbaik dari implementasi strategi ini.
    - **Exit Strategy:** Jika strategi tidak berhasil, apa rencana cadangan atau langkah yang akan diambil?

    **5. Kesimpulan & Saran Akhir**
    Rangkum strategi yang telah dibuat dan berikan saran penutup yang menginspirasi dan praktis untuk pemilik bisnis.
    `;

    try {
      fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        const apiData = await response.json();

        if (apiData.candidates && apiData.candidates[0].content) {
            const aiResponse = apiData.candidates[0].content.parts[0].text;
            const formattedResponse = marked.parse(aiResponse);
            
            strategyResultContainer.innerHTML = `
                <div class="report-content-umkm">
                    ${formattedResponse}
                </div>
            `;
            strategyResultContainer.style.display = 'block';

            setTimeout(() => {
                generateStrategyPDF(formData, strategyResultContainer.querySelector('.report-content-umkm').innerHTML);
            }, 2000);

        } else {
            strategyResultContainer.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat membuat laporan. Coba lagi nanti.</p>';
            strategyResultContainer.style.display = 'block';
        }
    } catch (err) {
        console.error(err);
        strategyResultContainer.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI. Mohon cek koneksi internet Anda atau coba lagi nanti.</p>';
        strategyResultContainer.style.display = 'block';
    } finally {
        strategyLoadingContainer.style.display = 'none';
    }
});
// ===== PREMIUM PROFITABILITY RATIO CALCULATOR (FULL SUITE) =====

    // ===== PREMIUM PROFITABILITY RATIO CALCULATOR (FIXED SALES INPUT) =====


    const ratioSelect = document.getElementById('ratio-type');
    const dynamicInputsContainer = document.getElementById('dynamic-inputs');
    const ratioDescription = document.getElementById('ratio-description');
    const calculateBtn = document.getElementById('calculate-ratio-btn');
    const profitabilityForm = document.getElementById('profitability-form');
    const profitabilityResult = document.getElementById('profitability-result');

    // Helper: Format Angka
    function formatNumberWithDots(number) {
        return number.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // --- DATABASE RASIO LENGKAP ---
    // Pastikan ID di sini unik dan tidak bentrok dengan ID input lain di halaman
    const ratioData = {
        // --- 1. Basic Margins ---
        'gpm': {
            name: "Gross Profit Ratio (GPM)",
            desc: "Persentase pendapatan yang tersisa setelah dikurangi HPP.",
            inputs: [{ id: "calc_sales", label: "Penjualan Bersih" }, { id: "calc_cogs", label: "HPP (Cost of Goods Sold)" }],
            formula: (v) => ((v.calc_sales - v.calc_cogs) / v.calc_sales) * 100, unit: '%'
        },
        'opm': {
            name: "Operating Income Ratio (OPM)",
            desc: "Laba dari operasi bisnis inti sebelum bunga dan pajak.",
            inputs: [{ id: "calc_op_income", label: "Pendapatan Operasional" }, { id: "calc_sales", label: "Penjualan Bersih" }],
            formula: (v) => (v.calc_op_income / v.calc_sales) * 100, unit: '%'
        },
        'npm': {
            name: "Net Profit Margin (NPM)",
            desc: "Persentase laba bersih dari total pendapatan.",
            inputs: [{ id: "calc_net_income", label: "Laba Bersih" }, { id: "calc_revenue", label: "Total Pendapatan" }],
            formula: (v) => (v.calc_net_income / v.calc_revenue) * 100, unit: '%'
        },
        'pretax-margin': {
            name: "Pretax Profit Margin",
            desc: "Profitabilitas perusahaan sebelum dipotong pajak.",
            inputs: [{ id: "calc_ebt", label: "Laba Sebelum Pajak (EBT)" }, { id: "calc_revenue", label: "Total Pendapatan" }],
            formula: (v) => (v.calc_ebt / v.calc_revenue) * 100, unit: '%'
        },
        
        // --- 2. EBIT & EBITDA Based ---
        'ebit-margin': {
            name: "EBIT Margin",
            desc: "Margin Laba Sebelum Bunga dan Pajak.",
            inputs: [{ id: "calc_ebit", label: "EBIT" }, { id: "calc_revenue", label: "Total Pendapatan" }],
            formula: (v) => (v.calc_ebit / v.calc_revenue) * 100, unit: '%'
        },
        'ebitda-margin': {
            name: "EBITDA Margin",
            desc: "Margin Laba Sebelum Bunga, Pajak, Depresiasi, dan Amortisasi.",
            inputs: [{ id: "calc_ebitda", label: "EBITDA" }, { id: "calc_revenue", label: "Total Pendapatan" }],
            formula: (v) => (v.calc_ebitda / v.calc_revenue) * 100, unit: '%'
        },
        'adjusted-ebitda': {
            name: "Adjusted EBITDA Margin",
            desc: "EBITDA yang disesuaikan dengan menghilangkan item tidak biasa/sekali waktu.",
            inputs: [{ id: "calc_adj_ebitda", label: "Adjusted EBITDA" }, { id: "calc_revenue", label: "Total Pendapatan" }],
            formula: (v) => (v.calc_adj_ebitda / v.calc_revenue) * 100, unit: '%'
        },

        // --- 3. Cash Flow & Economic ---
        'contribution-margin': {
            name: "Contribution Margin",
            desc: "Sisa penjualan setelah dikurangi biaya variabel.",
            inputs: [{ id: "calc_sales", label: "Total Penjualan" }, { id: "calc_var_cost", label: "Total Biaya Variabel" }],
            formula: (v) => ((v.calc_sales - v.calc_var_cost) / v.calc_sales) * 100, unit: '%'
        },
        'cash-profit': {
            name: "Cash Profit Margin",
            desc: "Rasio arus kas operasional terhadap penjualan.",
            inputs: [{ id: "calc_cash_ops", label: "Arus Kas Operasional" }, { id: "calc_sales", label: "Penjualan Bersih" }],
            formula: (v) => (v.calc_cash_ops / v.calc_sales) * 100, unit: '%'
        },
        'nopat-margin': {
            name: "Net Operating Profit After Tax (NOPAT) Margin",
            desc: "Laba operasional setelah pajak tanpa pengaruh utang.",
            inputs: [{ id: "calc_nopat", label: "NOPAT" }, { id: "calc_sales", label: "Penjualan Bersih" }],
            formula: (v) => (v.calc_nopat / v.calc_sales) * 100, unit: '%'
        },
        'economic-profit': {
            name: "Economic Profit Margin",
            desc: "Laba dikurangi biaya modal (equity & debt).",
            inputs: [{ id: "calc_nopat", label: "NOPAT" }, { id: "calc_capital", label: "Total Modal" }, { id: "calc_wacc", label: "WACC (%)", type: "number" }],
            formula: (v) => (v.calc_nopat - (v.calc_capital * (v.calc_wacc / 100))), unit: 'Currency'
        },
        'residual-income': {
            name: "Residual Income Ratio",
            desc: "Laba operasional dikurangi biaya modal minimum yang diminta.",
            inputs: [{ id: "calc_op_income", label: "Pendapatan Operasional" }, { id: "calc_min_return", label: "Minimum Required Return (Rp)" }],
            formula: (v) => (v.calc_op_income - v.calc_min_return), unit: 'Currency'
        },
        'fcf-margin': {
            name: "Free Cash Flow Margin",
            desc: "Persentase pendapatan yang menjadi arus kas bebas.",
            inputs: [{ id: "calc_fcf", label: "Free Cash Flow" }, { id: "calc_revenue", label: "Total Pendapatan" }],
            formula: (v) => (v.calc_fcf / v.calc_revenue) * 100, unit: '%'
        },
        'value-added': {
            name: "Value Added Margin",
            desc: "Nilai tambah yang dihasilkan perusahaan per unit pendapatan.",
            inputs: [{ id: "calc_value_added", label: "Value Added (Output - Input)" }, { id: "calc_revenue", label: "Total Pendapatan" }],
            formula: (v) => (v.calc_value_added / v.calc_revenue) * 100, unit: '%'
        },

        // --- 4. Returns on Assets/Equity/Capital ---
        'roa': {
            name: "Return on Assets (ROA)",
            desc: "Efisiensi aset menghasilkan laba bersih.",
            inputs: [{ id: "calc_net_income", label: "Laba Bersih" }, { id: "calc_total_assets", label: "Total Aset Rata-rata" }],
            formula: (v) => (v.calc_net_income / v.calc_total_assets) * 100, unit: '%'
        },
        'roe': {
            name: "Return on Equity (ROE)",
            desc: "Pengembalian atas modal pemegang saham.",
            inputs: [{ id: "calc_net_income", label: "Laba Bersih" }, { id: "calc_equity", label: "Ekuitas Pemegang Saham" }],
            formula: (v) => (v.calc_net_income / v.calc_equity) * 100, unit: '%'
        },
        'roi': {
            name: "Return on Investment (ROI)",
            desc: "Efisiensi keuntungan dari biaya investasi.",
            inputs: [{ id: "calc_gain", label: "Keuntungan Investasi" }, { id: "calc_cost", label: "Biaya Investasi" }],
            formula: (v) => ((v.calc_gain - v.calc_cost) / v.calc_cost) * 100, unit: '%'
        },
        'roic': {
            name: "Return on Invested Capital (ROIC)",
            desc: "Pengembalian modal yang diinvestasikan (Hutang + Ekuitas).",
            inputs: [{ id: "calc_nopat", label: "NOPAT" }, { id: "calc_inv_capital", label: "Invested Capital" }],
            formula: (v) => (v.calc_nopat / v.calc_inv_capital) * 100, unit: '%'
        },
        'roce': {
            name: "Return on Capital Employed (ROCE)",
            desc: "Efisiensi penggunaan modal kerja.",
            inputs: [{ id: "calc_ebit", label: "EBIT" }, { id: "calc_cap_employed", label: "Capital Employed (Aset - Liabilitas Lancar)" }],
            formula: (v) => (v.calc_ebit / v.calc_cap_employed) * 100, unit: '%'
        },
        'rona': {
            name: "Return on Net Assets (RONA)",
            desc: "Pengembalian atas aset bersih (Aset Tetap + Modal Kerja Bersih).",
            inputs: [{ id: "calc_net_income", label: "Laba Bersih" }, { id: "calc_fixed_assets", label: "Aset Tetap" }, { id: "calc_net_working_cap", label: "Modal Kerja Bersih" }],
            formula: (v) => (v.calc_net_income / (v.calc_fixed_assets + v.calc_net_working_cap)) * 100, unit: '%'
        },
        'roas': {
            name: "Return on Assets Sales (ROAS)",
            desc: "Rasio profitabilitas aset terhadap penjualan.",
            inputs: [{ id: "calc_pretax_income", label: "Laba Sebelum Pajak" }, { id: "calc_avg_assets", label: "Aset Rata-rata" }],
            formula: (v) => (v.calc_pretax_income / v.calc_avg_assets) * 100, unit: '%'
        },
        'ros': {
            name: "Return on Sales (ROS)",
            desc: "Efisiensi operasional dalam menghasilkan laba dari penjualan.",
            inputs: [{ id: "calc_ebit", label: "EBIT" }, { id: "calc_sales", label: "Penjualan Bersih" }],
            formula: (v) => (v.calc_ebit / v.calc_sales) * 100, unit: '%'
        },
        'ros-pretax': {
            name: "Return on Sales Before Tax",
            desc: "ROS menggunakan laba sebelum pajak.",
            inputs: [{ id: "calc_ebt", label: "Laba Sebelum Pajak" }, { id: "calc_sales", label: "Penjualan Bersih" }],
            formula: (v) => (v.calc_ebt / v.calc_sales) * 100, unit: '%'
        },
        'roa-pretax': {
            name: "Return on Assets Before Tax",
            desc: "ROA menggunakan laba sebelum pajak.",
            inputs: [{ id: "calc_ebt", label: "Laba Sebelum Pajak" }, { id: "calc_assets", label: "Total Aset" }],
            formula: (v) => (v.calc_ebt / v.calc_assets) * 100, unit: '%'
        },
        'return-tangible': {
            name: "Return on Tangible Assets",
            desc: "Pengembalian atas aset berwujud saja.",
            inputs: [{ id: "calc_net_income", label: "Laba Bersih" }, { id: "calc_tangible", label: "Total Aset Berwujud" }],
            formula: (v) => (v.calc_net_income / v.calc_tangible) * 100, unit: '%'
        },
        'return-fixed': {
            name: "Return on Fixed Assets",
            desc: "Pengembalian khusus dari aset tetap (mesin, gedung, dll).",
            inputs: [{ id: "calc_net_income", label: "Laba Bersih" }, { id: "calc_fixed_assets", label: "Aset Tetap Bersih" }],
            formula: (v) => (v.calc_net_income / v.calc_fixed_assets) * 100, unit: '%'
        },
        'return-invested': {
            name: "Return on Invested Assets",
            desc: "Laba atas aset yang secara aktif diinvestasikan.",
            inputs: [{ id: "calc_net_income", label: "Laba Bersih" }, { id: "calc_invested_assets", label: "Aset Investasi" }],
            formula: (v) => (v.calc_net_income / v.calc_invested_assets) * 100, unit: '%'
        },
        'return-gross-assets': {
            name: "Return on Gross Assets",
            desc: "Pengembalian atas aset kotor (sebelum depresiasi).",
            inputs: [{ id: "calc_cf_ops", label: "Arus Kas Operasi" }, { id: "calc_gross_assets", label: "Aset Kotor Rata-rata" }],
            formula: (v) => (v.calc_cf_ops / v.calc_gross_assets) * 100, unit: '%'
        },
        'return-avg-equity': {
            name: "Return on Average Equity (ROAE)",
            desc: "Menggunakan rata-rata ekuitas awal dan akhir tahun.",
            inputs: [{ id: "calc_net_income", label: "Laba Bersih" }, { id: "calc_equity_start", label: "Ekuitas Awal" }, { id: "calc_equity_end", label: "Ekuitas Akhir" }],
            formula: (v) => (v.calc_net_income / ((v.calc_equity_start + v.calc_equity_end) / 2)) * 100, unit: '%'
        },
        'operating-roa': {
            name: "Operating Return on Assets",
            desc: "Laba operasional dibagi total aset.",
            inputs: [{ id: "calc_op_income", label: "Pendapatan Operasional" }, { id: "calc_assets", label: "Total Aset" }],
            formula: (v) => (v.calc_op_income / v.calc_assets) * 100, unit: '%'
        },

        // --- 5. Other Specific Ratios ---
        'core-operating-margin': {
            name: "Core Operating Profit Margin",
            desc: "Margin dari aktivitas bisnis inti saja.",
            inputs: [{ id: "calc_core_profit", label: "Laba Inti (Core Profit)" }, { id: "calc_revenue", label: "Pendapatan" }],
            formula: (v) => (v.calc_core_profit / v.calc_revenue) * 100, unit: '%'
        },
        'recurring-profit': {
            name: "Recurring Profit Margin",
            desc: "Margin dari laba yang berulang (sustainable).",
            inputs: [{ id: "calc_recur_profit", label: "Recurring Profit" }, { id: "calc_revenue", label: "Pendapatan" }],
            formula: (v) => (v.calc_recur_profit / v.calc_revenue) * 100, unit: '%'
        },
        'profit-per-employee': {
            name: "Profit per Employee Ratio",
            desc: "Laba bersih yang dihasilkan oleh setiap karyawan.",
            inputs: [{ id: "calc_net_income", label: "Laba Bersih" }, { id: "calc_employees", label: "Jumlah Karyawan", type: "number" }],
            formula: (v) => (v.calc_net_income / v.calc_employees), unit: 'Currency'
        }
    };

    // --- EVENT LISTENER UTAMA ---
    if (ratioSelect) {
        ratioSelect.addEventListener('change', function() {
            const selectedKey = this.value;
            const data = ratioData[selectedKey];

            if (!data) return;

            // 1. Update Deskripsi
            ratioDescription.innerHTML = `
                <div class="placeholder-content">
                    <img src="https://cdn-icons-png.flaticon.com/512/2920/2920323.png" alt="Analytics" class="placeholder-icon-img" style="width:40px; margin-bottom:10px;">
                    <h4 style="color:#333; margin:0;">${data.name}</h4>
                    <p style="font-size:0.9rem; color:#666; margin-top:5px;">${data.desc}</p>
                </div>
            `;

            // 2. Generate Input Fields
            dynamicInputsContainer.innerHTML = '';
            
            data.inputs.forEach((input, index) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'form-group fade-in-up';
                wrapper.style.animationDelay = `${index * 0.1}s`;

                const label = document.createElement('label');
                label.setAttribute('for', input.id);
                label.innerText = input.label;

                const inputEl = document.createElement('input');
                inputEl.id = input.id;
                
                // Cek tipe input
                if (input.type === 'number') {
                    inputEl.type = 'number';
                    inputEl.placeholder = "0";
                } else {
                    inputEl.type = 'text';
                    inputEl.className = 'input-nominal';
                    inputEl.placeholder = "Rp 0";
                    
                    // Attach Formatter Langsung
                    inputEl.addEventListener('input', function() {
                        let val = this.value.replace(/\./g, '');
                        this.value = formatNumberWithDots(val);
                    });
                }
                
                inputEl.required = true;

                wrapper.appendChild(label);
                wrapper.appendChild(inputEl);
                dynamicInputsContainer.appendChild(wrapper);
            });

            // 3. Tampilkan Tombol Hitung
            calculateBtn.style.display = 'flex';
            profitabilityResult.style.display = 'none';
        });
    }

    // --- EVENT SUBMIT & AI ---
    if (profitabilityForm) {
        profitabilityForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const selectedKey = ratioSelect.value;
            const data = ratioData[selectedKey];
            if (!data) return;

            // 1. AMBIL DATA INPUT (Fixed Logic)
            const inputValues = {};
            let isValid = true;

            data.inputs.forEach(inputDef => {
                const inputEl = document.getElementById(inputDef.id);
                if (inputEl) {
                    if (inputDef.type === 'number') {
                        inputValues[inputDef.id] = parseFloat(inputEl.value);
                    } else {
                        // Bersihkan titik ribuan sebelum parsing
                        const rawVal = inputEl.value.replace(/\./g, '');
                        inputValues[inputDef.id] = parseFloat(rawVal) || 0;
                    }
                    
                    // Cek jika NaN (kecuali jika 0 memang nilai valid)
                    if (isNaN(inputValues[inputDef.id])) {
                        isValid = false;
                    }
                } else {
                    isValid = false; // Input element tidak ditemukan di DOM
                }
            });

            if (!isValid) {
                alert("Mohon isi semua data dengan angka yang valid.");
                return;
            }

            // 2. HITUNG HASIL
            let resultValue = 0;
            try {
                resultValue = data.formula(inputValues);
            } catch (e) {
                console.error("Rumus Error:", e);
                alert("Terjadi kesalahan perhitungan.");
                return;
            }
            
            // 3. DEFINISIKAN displayResult (Agar tidak error)
            let displayResult = '';
            if (!isFinite(resultValue) || isNaN(resultValue)) {
                displayResult = "Data Tidak Valid"; // Cegah Infinity/NaN
            } else if (data.unit === '%') {
                displayResult = resultValue.toFixed(2) + '%';
            } else if (data.unit === 'Currency') {
                displayResult = 'Rp ' + resultValue.toLocaleString('id-ID', { maximumFractionDigits: 0 });
            } else {
                displayResult = resultValue.toFixed(2);
            }

            // 4. UI LOADING
            if (profitabilityResult) {
                profitabilityResult.style.display = 'block';
                profitabilityResult.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <div class="loading-spinner" style="margin: 0 auto 15px;"></div>
                        <p style="color: #666; font-weight:500;">AI sedang menganalisis data keuangan Anda...</p>
                    </div>
                `;
                profitabilityResult.scrollIntoView({ behavior: 'smooth' });
            }

            // 5. SIAPKAN PROMPT AI
            const inputsText = data.inputs.map(inp => 
                `- ${inp.label}: ${inputValues[inp.id].toLocaleString('id-ID')}`
            ).join('\n');

            const prompt = `
                Bertindaklah sebagai Konsultan Keuangan Korporat Senior. Analisis rasio berikut:
                
                **Jenis Rasio:** ${data.name}
                **Data Input:**
                ${inputsText}
                
                **Hasil Perhitungan:** ${displayResult}
                
                **Tugas:**
                1. Interpretasi: Apa arti angka ${displayResult} ini? (Apakah sehat/buruk dibandingkan rata-rata industri umum?)
                2. Diagnosa: Faktor apa dari input (${inputsText}) yang paling mempengaruhi hasil ini?
                3. Strategi: Berikan 3 langkah konkret, teknis, dan strategis untuk meningkatkan rasio ini di kuartal berikutnya.
                
                **ATURAN FORMAT PENTING (WAJIB DIPATUHI):**
                - Gunakan format Markdown standar (tebal, daftar, paragraf).
                - **JANGAN gunakan sintaks LaTeX, MathJax, atau simbol matematika rumit (seperti $, \\frac, \\times).** Browser tidak dapat membacanya.
                - Jika ingin menulis rumus, gunakan teks biasa yang mudah dibaca. 
                  Contoh SALAH: $ROI = \\frac{A}{B}$
                  Contoh BENAR: ROI = (Keuntungan / Biaya Investasi) x 100%
                - Gunakan bahasa profesional, elegan, dan to-the-point.
            `;

            // 6. KIRIM KE API GEMINI
           fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
            .then(res => res.json())
            .then(apiData => {
                if (apiData.candidates && apiData.candidates[0].content) {
                    const aiResponse = marked.parse(apiData.candidates[0].content.parts[0].text);

                    profitabilityResult.innerHTML = `
                        <div class="result-card fade-in">
                            <div class="result-header" style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                                <span style="text-transform: uppercase; letter-spacing: 1px; color: #888; font-size: 0.9rem;">Hasil Perhitungan</span>
                                <h1 style="font-size: 4rem; font-weight: 800; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 10px 0;">
                                    ${displayResult}
                                </h1>
                                <span style="font-size: 1.2rem; color: #555; font-weight: 500;">${data.name}</span>
                            </div>
                            <div class="ai-analysis-content" style="line-height: 1.8; color: #444; font-size: 1.05rem;">
                                ${aiResponse}
                            </div>
                        </div>
                    `;
                } else {
                    profitabilityResult.innerHTML = '<p style="color: red; text-align:center;">Maaf, AI tidak dapat memberikan analisis.</p>';
                }
            })
            .catch(err => {
                console.error(err);
                profitabilityResult.innerHTML = '<p style="color: red; text-align:center;">Terjadi kesalahan koneksi.</p>';
            });
        });
    }

// ===== LIQUIDITY RATIO CALCULATOR (FULL SUITE) =====

    const liqSelect = document.getElementById('liq-ratio-type');
    const liqInputsContainer = document.getElementById('liq-dynamic-inputs');
    const liqDescription = document.getElementById('liq-ratio-description');
    const calculateLiqBtn = document.getElementById('calculate-liq-btn');
    const liquidityForm = document.getElementById('liquidity-form');
    const liquidityResult = document.getElementById('liquidity-result');

    // Format Angka (Helper yang sama)
    function formatNumberWithDots(number) {
        return number.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // --- DATABASE RASIO LIKUIDITAS (UNIQUE IDs: liq_*) ---
    const liquidityData = {
        // 1. Rasio Utama
        'current-ratio': {
            name: "Current Ratio",
            desc: "Mengukur kemampuan perusahaan membayar kewajiban jangka pendek dengan aset lancar.",
            inputs: [{ id: "liq_ca", label: "Aset Lancar (Current Assets)" }, { id: "liq_cl", label: "Liabilitas Lancar (Current Liabilities)" }],
            formula: (v) => (v.liq_ca / v.liq_cl), unit: 'x'
        },
        'quick-ratio': {
            name: "Quick Ratio (Acid-Test)",
            desc: "Mengukur kemampuan membayar kewajiban lancar tanpa mengandalkan penjualan persediaan.",
            inputs: [{ id: "liq_ca", label: "Aset Lancar" }, { id: "liq_inventory", label: "Persediaan (Inventory)" }, { id: "liq_cl", label: "Liabilitas Lancar" }],
            formula: (v) => ((v.liq_ca - v.liq_inventory) / v.liq_cl), unit: 'x'
        },
        'cash-ratio': {
            name: "Cash Ratio",
            desc: "Rasio likuiditas paling konservatif, hanya menghitung kas dan setara kas.",
            inputs: [{ id: "liq_cash", label: "Kas & Setara Kas" }, { id: "liq_cl", label: "Liabilitas Lancar" }],
            formula: (v) => (v.liq_cash / v.liq_cl), unit: 'x'
        },
        'working-capital-ratio': {
            name: "Working Capital Ratio",
            desc: "Sinonim dengan Current Ratio, mengukur kesehatan modal kerja.",
            inputs: [{ id: "liq_ca", label: "Aset Lancar" }, { id: "liq_cl", label: "Liabilitas Lancar" }],
            formula: (v) => (v.liq_ca / v.liq_cl), unit: 'x'
        },

        // 2. Arus Kas
        'ocf-ratio': {
            name: "Operating Cash Flow Ratio",
            desc: "Seberapa baik arus kas operasional menutupi kewajiban lancar.",
            inputs: [{ id: "liq_ocf", label: "Arus Kas Operasional" }, { id: "liq_cl", label: "Liabilitas Lancar" }],
            formula: (v) => (v.liq_ocf / v.liq_cl), unit: 'x'
        },
        'cash-flow-coverage': {
            name: "Cash Flow Coverage Ratio",
            desc: "Kemampuan arus kas operasional menutupi total utang.",
            inputs: [{ id: "liq_ocf", label: "Arus Kas Operasional" }, { id: "liq_total_debt", label: "Total Utang" }],
            formula: (v) => (v.liq_ocf / v.liq_total_debt), unit: 'x'
        },
        'cash-flow-liquidity': {
            name: "Cash Flow Liquidity Ratio",
            desc: "Membandingkan kas dan aset likuid terhadap kewajiban lancar.",
            inputs: [{ id: "liq_cash_security", label: "Kas + Surat Berharga" }, { id: "liq_ocf", label: "Arus Kas Operasi" }, { id: "liq_cl", label: "Liabilitas Lancar" }],
            formula: (v) => ((v.liq_cash_security + v.liq_ocf) / v.liq_cl), unit: 'x'
        },
        'ocf-to-current-debt': {
            name: "OCF to Current Debt Ratio",
            desc: "Persentase utang lancar yang bisa dibayar dengan arus kas tahun berjalan.",
            inputs: [{ id: "liq_ocf", label: "Arus Kas Operasional" }, { id: "liq_current_debt", label: "Utang Lancar (Financial Debt)" }],
            formula: (v) => (v.liq_ocf / v.liq_current_debt), unit: 'x'
        },
        'cash-conversion-ratio': {
            name: "Cash Conversion Ratio",
            desc: "Efisiensi mengubah laba operasi/bersih menjadi uang tunai.",
            inputs: [{ id: "liq_ocf", label: "Arus Kas Operasional" }, { id: "liq_ebitda", label: "EBITDA (atau Laba Bersih)" }],
            formula: (v) => (v.liq_ocf / v.liq_ebitda) * 100, unit: '%'
        },

        // 3. Aset & Modal Kerja
        'net-working-capital': {
            name: "Net Working Capital (Nominal)",
            desc: "Selisih nominal antara aset lancar dan liabilitas lancar.",
            inputs: [{ id: "liq_ca", label: "Aset Lancar" }, { id: "liq_cl", label: "Liabilitas Lancar" }],
            formula: (v) => (v.liq_ca - v.liq_cl), unit: 'Currency'
        },
        'nwc-ratio': {
            name: "Net Working Capital Ratio",
            desc: "Proporsi modal kerja bersih terhadap total aset.",
            inputs: [{ id: "liq_ca", label: "Aset Lancar" }, { id: "liq_cl", label: "Liabilitas Lancar" }, { id: "liq_total_assets", label: "Total Aset" }],
            formula: (v) => ((v.liq_ca - v.liq_cl) / v.liq_total_assets) * 100, unit: '%'
        },
        'current-assets-to-total': {
            name: "Current Assets to Total Assets",
            desc: "Seberapa besar porsi aset perusahaan yang bersifat likuid.",
            inputs: [{ id: "liq_ca", label: "Aset Lancar" }, { id: "liq_total_assets", label: "Total Aset" }],
            formula: (v) => (v.liq_ca / v.liq_total_assets) * 100, unit: '%'
        },
        'quick-assets-to-total': {
            name: "Quick Assets to Total Assets",
            desc: "Porsi aset sangat likuid terhadap total aset.",
            inputs: [{ id: "liq_ca", label: "Aset Lancar" }, { id: "liq_inv", label: "Persediaan" }, { id: "liq_total_assets", label: "Total Aset" }],
            formula: (v) => ((v.liq_ca - v.liq_inv) / v.liq_total_assets) * 100, unit: '%'
        },
        'liquid-assets-ratio': {
            name: "Liquid Assets Ratio",
            desc: "Rasio aset likuid terhadap total aset saat ini.",
            inputs: [{ id: "liq_liquid_assets", label: "Aset Likuid (Kas + Piutang + Efek)" }, { id: "liq_total_assets", label: "Total Aset" }],
            formula: (v) => (v.liq_liquid_assets / v.liq_total_assets) * 100, unit: '%'
        },
        'net-liquid-balance': {
            name: "Net Liquid Balance Ratio",
            desc: "Keseimbangan aset kas dikurangi kewajiban finansial lancar terhadap total aset.",
            inputs: [{ id: "liq_cash_sec", label: "Kas + Surat Berharga" }, { id: "liq_fin_liab", label: "Kewajiban Finansial Lancar" }, { id: "liq_total_assets", label: "Total Aset" }],
            formula: (v) => ((v.liq_cash_sec - v.liq_fin_liab) / v.liq_total_assets) * 100, unit: '%'
        },

        // 4. Solvabilitas & Interval
        'defensive-interval': {
            name: "Defensive Interval Ratio",
            desc: "Berapa hari perusahaan bisa bertahan dengan aset likuid tanpa pendapatan.",
            inputs: [{ id: "liq_quick_assets", label: "Quick Assets (Kas + Piutang + Efek)" }, { id: "liq_daily_exp", label: "Pengeluaran Operasional Harian" }],
            formula: (v) => (v.liq_quick_assets / v.liq_daily_exp), unit: 'Hari'
        },
        'interval-measure': {
            name: "Interval Measure Ratio",
            desc: "Sama dengan Defensive Interval, mengukur ketahanan waktu.",
            inputs: [{ id: "liq_ca", label: "Aset Lancar" }, { id: "liq_inv", label: "Persediaan" }, { id: "liq_avg_daily_exp", label: "Rata-rata Pengeluaran Harian" }],
            formula: (v) => ((v.liq_ca - v.liq_inv) / v.liq_avg_daily_exp), unit: 'Hari'
        },
        'short-term-solvency': {
            name: "Short-Term Solvency Ratio",
            desc: "Indikator umum kemampuan membayar utang jangka pendek (mirip Current Ratio).",
            inputs: [{ id: "liq_ca", label: "Aset Lancar" }, { id: "liq_cl", label: "Liabilitas Lancar" }],
            formula: (v) => (v.liq_ca / v.liq_cl), unit: 'x'
        },
        'immediate-liquidity': {
            name: "Immediate Liquidity Ratio",
            desc: "Hanya menghitung Kas (sangat likuid) terhadap kewajiban lancar.",
            inputs: [{ id: "liq_cash", label: "Kas" }, { id: "liq_cl", label: "Liabilitas Lancar" }],
            formula: (v) => (v.liq_cash / v.liq_cl), unit: 'x'
        },

        // 5. Kas Spesifik
        'cash-to-cl': {
            name: "Cash to Current Liabilities",
            desc: "Porsi kas murni terhadap utang lancar.",
            inputs: [{ id: "liq_cash", label: "Kas" }, { id: "liq_cl", label: "Liabilitas Lancar" }],
            formula: (v) => (v.liq_cash / v.liq_cl), unit: 'x'
        },
        'cash-marketable-sec': {
            name: "Cash & Marketable Securities Ratio",
            desc: "Kas ditambah surat berharga pasar terhadap aset lancar.",
            inputs: [{ id: "liq_cash_sec", label: "Kas + Surat Berharga" }, { id: "liq_ca", label: "Aset Lancar" }],
            formula: (v) => (v.liq_cash_sec / v.liq_ca) * 100, unit: '%'
        }
    };

    // --- EVENT LISTENER (SELECT RASIO) ---
    if (liqSelect) {
        liqSelect.addEventListener('change', function() {
            const selectedKey = this.value;
            const data = liquidityData[selectedKey];

            if (!data) return;

            // Update Deskripsi
            liqDescription.innerHTML = `
                <div class="placeholder-content">
                    <img src="https://cdn-icons-png.flaticon.com/512/10156/10156637.png" alt="Liquidity" class="placeholder-icon-img" style="width:40px; margin-bottom:10px;">
                    <h4 style="color:#333; margin:0;">${data.name}</h4>
                    <p style="font-size:0.9rem; color:#666; margin-top:5px;">${data.desc}</p>
                </div>
            `;

            // Buat Input Dinamis
            liqInputsContainer.innerHTML = '';
            
            data.inputs.forEach((input, index) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'form-group fade-in-up';
                wrapper.style.animationDelay = `${index * 0.1}s`;

                const label = document.createElement('label');
                label.setAttribute('for', input.id);
                label.innerText = input.label;
                label.style.fontWeight = "600";
                label.style.marginBottom = "8px";
                label.style.display = "block";
                label.style.color = "#444";

                const inputEl = document.createElement('input');
                inputEl.id = input.id;
                
                if (input.type === 'number') {
                    inputEl.type = 'number';
                    inputEl.placeholder = "0";
                } else {
                    inputEl.type = 'text';
                    inputEl.className = 'input-nominal';
                    inputEl.placeholder = "Rp 0";
                    // Format Uang Otomatis
                    inputEl.addEventListener('input', function() {
                        let val = this.value.replace(/\./g, '');
                        this.value = formatNumberWithDots(val);
                    });
                }
                
                // Styling agar sama persis dengan profitabilitas
                inputEl.style.width = "100%";
                inputEl.style.padding = "12px 15px";
                inputEl.style.borderRadius = "10px";
                inputEl.style.border = "1px solid #ccc";
                inputEl.style.backgroundColor = "#fff";
                inputEl.style.fontSize = "1rem";
                inputEl.required = true;

                wrapper.appendChild(label);
                wrapper.appendChild(inputEl);
                liqInputsContainer.appendChild(wrapper);
            });

            calculateLiqBtn.style.display = 'flex';
            liquidityResult.style.display = 'none';
        });
    }

    // --- EVENT SUBMIT & AI ---
    if (liquidityForm) {
        liquidityForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const selectedKey = liqSelect.value;
            const data = liquidityData[selectedKey];
            if (!data) return;

            // Ambil Input
            const inputValues = {};
            let isValid = true;

            data.inputs.forEach(inputDef => {
                const inputEl = document.getElementById(inputDef.id);
                if (inputEl) {
                    if (inputDef.type === 'number') {
                        inputValues[inputDef.id] = parseFloat(inputEl.value);
                    } else {
                        const rawVal = inputEl.value.replace(/\./g, '');
                        inputValues[inputDef.id] = parseFloat(rawVal) || 0;
                    }
                    if (isNaN(inputValues[inputDef.id])) isValid = false;
                } else {
                    isValid = false;
                }
            });

            if (!isValid) {
                alert("Mohon isi semua data dengan angka yang valid.");
                return;
            }

            // Hitung
            let resultValue = 0;
            try {
                resultValue = data.formula(inputValues);
            } catch (e) {
                resultValue = 0;
            }

            // Format Hasil
            let displayResult = '';
            if (!isFinite(resultValue) || isNaN(resultValue)) {
                displayResult = "Data Tidak Valid (Infinity)";
            } else if (data.unit === '%') {
                displayResult = resultValue.toFixed(2) + '%';
            } else if (data.unit === 'Currency') {
                displayResult = 'Rp ' + resultValue.toLocaleString('id-ID', { maximumFractionDigits: 0 });
            } else if (data.unit === 'Hari') {
                displayResult = resultValue.toFixed(1) + ' Hari';
            } else {
                displayResult = resultValue.toFixed(2) + 'x'; // Default ratio unit
            }

            // Loading UI
            liquidityResult.style.display = 'block';
            liquidityResult.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div class="loading-spinner" style="margin: 0 auto 15px;"></div>
                    <p style="color: #666;">AI sedang menganalisis likuiditas...</p>
                </div>
            `;
            liquidityResult.scrollIntoView({ behavior: 'smooth' });

            // Prompt AI
            const inputsText = data.inputs.map(inp => 
                `- ${inp.label}: ${inputValues[inp.id].toLocaleString('id-ID')}`
            ).join('\n');

            const prompt = `
                Bertindaklah sebagai Analis Kredit dan Risiko Keuangan. Analisis Rasio Likuiditas berikut:
                
                **Jenis Rasio:** ${data.name}
                **Data Input:**
                ${inputsText}
                
                **Hasil Perhitungan:** ${displayResult}
                
                **Tugas:**
                1. **Status Kesehatan:** Apakah angka ${displayResult} ini menunjukkan perusahaan mampu membayar kewajiban jangka pendeknya? (Bandingkan dengan standar umum, misal Current Ratio > 1.5x dianggap aman).
                2. **Diagnosa Risiko:** Apa risiko jika angka ini terlalu rendah (gagal bayar?) atau terlalu tinggi (aset menganggur?).
                3. **Rekomendasi:** Berikan 3 strategi konkret untuk memperbaiki posisi likuiditas ini tanpa mengorbankan profitabilitas.
                
                **ATURAN FORMAT:**
                - Gunakan format Markdown (poin, bold).
                - JANGAN gunakan simbol LaTeX/Matematika rumit. Gunakan teks biasa.
                - Bahasa profesional, to-the-point, dan solutif.
            `;

            // Fetch API
            fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
            .then(res => res.json())
            .then(apiData => {
                if (apiData.candidates && apiData.candidates[0].content) {
                    const aiResponse = marked.parse(apiData.candidates[0].content.parts[0].text);
                    
                    liquidityResult.innerHTML = `
                        <div class="result-card fade-in">
                            <div class="result-header" style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                                <span style="text-transform: uppercase; letter-spacing: 1px; color: #888; font-size: 0.9rem;">Posisi Likuiditas</span>
                                <h1 class="text-gradient-cyan" style="font-size: 4rem; font-weight: 800; margin: 10px 0;">
                                    ${displayResult}
                                </h1>
                                <span style="font-size: 1.2rem; color: #555; font-weight: 500;">${data.name}</span>
                            </div>
                            <div class="ai-analysis-content" style="line-height: 1.8; color: #444; font-size: 1.05rem;">
                                ${aiResponse}
                            </div>
                        </div>
                    `;
                } else {
                    liquidityResult.innerHTML = '<p class="error">Gagal mendapatkan analisis AI.</p>';
                }
            })
            .catch(err => {
                console.error(err);
                liquidityResult.innerHTML = '<p class="error">Terjadi kesalahan koneksi.</p>';
            });
        });
    }
// ===== SOLVENCY RATIO CALCULATOR (FULL SUITE) =====

    const solSelect = document.getElementById('sol-ratio-type');
    const solInputsContainer = document.getElementById('sol-dynamic-inputs');
    const solDescription = document.getElementById('sol-ratio-description');
    const calculateSolBtn = document.getElementById('calculate-sol-btn');
    const solvencyForm = document.getElementById('solvency-form');
    const solvencyResult = document.getElementById('solvency-result');

    // Helper: Format Angka
    function formatNumberWithDots(number) {
        return number.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // --- DATABASE RASIO SOLVABILITAS (UNIQUE IDs: sol_*) ---
    const solvencyData = {
        // --- 1. Rasio Utang & Aset ---
        'debt-ratio': {
            name: "Debt Ratio",
            desc: "Persentase total aset yang dibiayai oleh utang.",
            inputs: [{ id: "sol_total_debt", label: "Total Utang (Total Debt)" }, { id: "sol_total_assets", label: "Total Aset" }],
            formula: (v) => (v.sol_total_debt / v.sol_total_assets) * 100, unit: '%'
        },
        'total-debt-to-assets': {
            name: "Total Debt to Total Assets",
            desc: "Sama dengan Debt Ratio, mengukur porsi utang terhadap aset.",
            inputs: [{ id: "sol_total_debt", label: "Total Utang" }, { id: "sol_total_assets", label: "Total Aset" }],
            formula: (v) => (v.sol_total_debt / v.sol_total_assets) * 100, unit: '%'
        },
        'lt-debt-ratio': {
            name: "Long-Term Debt Ratio",
            desc: "Persentase aset yang dibiayai oleh utang jangka panjang.",
            inputs: [{ id: "sol_lt_debt", label: "Utang Jangka Panjang" }, { id: "sol_total_assets", label: "Total Aset" }],
            formula: (v) => (v.sol_lt_debt / v.sol_total_assets) * 100, unit: '%'
        },
        'debt-to-capital': {
            name: "Debt to Capital Ratio",
            desc: "Proporsi utang terhadap total struktur modal (Utang + Ekuitas).",
            inputs: [{ id: "sol_total_debt", label: "Total Utang" }, { id: "sol_equity", label: "Total Ekuitas" }],
            formula: (v) => (v.sol_total_debt / (v.sol_total_debt + v.sol_equity)) * 100, unit: '%'
        },

        // --- 2. Struktur Modal ---
        'der': {
            name: "Debt to Equity Ratio (DER)",
            desc: "Rasio utang terhadap modal sendiri. Indikator utama leverage.",
            inputs: [{ id: "sol_total_debt", label: "Total Utang" }, { id: "sol_equity", label: "Total Ekuitas" }],
            formula: (v) => (v.sol_total_debt / v.sol_equity), unit: 'x'
        },
        'lt-der': {
            name: "Long-Term Debt to Equity Ratio",
            desc: "Risiko utang jangka panjang dibandingkan modal pemilik.",
            inputs: [{ id: "sol_lt_debt", label: "Utang Jangka Panjang" }, { id: "sol_equity", label: "Total Ekuitas" }],
            formula: (v) => (v.sol_lt_debt / v.sol_equity), unit: 'x'
        },
        'equity-ratio': {
            name: "Equity Ratio",
            desc: "Porsi aset yang didanai oleh pemilik/pemegang saham.",
            inputs: [{ id: "sol_equity", label: "Total Ekuitas" }, { id: "sol_total_assets", label: "Total Aset" }],
            formula: (v) => (v.sol_equity / v.sol_total_assets) * 100, unit: '%'
        },
        'equity-to-assets': {
            name: "Equity to Assets Ratio",
            desc: "Sama dengan Equity Ratio, menunjukkan kesehatan finansial.",
            inputs: [{ id: "sol_equity", label: "Total Ekuitas" }, { id: "sol_total_assets", label: "Total Aset" }],
            formula: (v) => (v.sol_equity / v.sol_total_assets) * 100, unit: '%'
        },
        'capital-structure': {
            name: "Capital Structure Ratio",
            desc: "Sering dihitung sebagai Utang / (Utang + Ekuitas) atau rasio leverage.",
            inputs: [{ id: "sol_total_debt", label: "Total Utang" }, { id: "sol_equity", label: "Total Ekuitas" }],
            formula: (v) => (v.sol_total_debt / (v.sol_total_debt + v.sol_equity)) * 100, unit: '%'
        },
        'equity-multiplier': {
            name: "Equity Multiplier",
            desc: "Komponen DuPont Analysis, mengukur penggunaan aset terhadap ekuitas.",
            inputs: [{ id: "sol_total_assets", label: "Total Aset" }, { id: "sol_equity", label: "Total Ekuitas" }],
            formula: (v) => (v.sol_total_assets / v.sol_equity), unit: 'x'
        },

        // --- 3. Coverage ---
        'interest-coverage': {
            name: "Interest Coverage Ratio (TIE)",
            desc: "Kemampuan membayar beban bunga dari laba operasional (EBIT).",
            inputs: [{ id: "sol_ebit", label: "EBIT (Laba Operasional)" }, { id: "sol_interest", label: "Beban Bunga" }],
            formula: (v) => (v.sol_ebit / v.sol_interest), unit: 'x'
        },
        'cash-interest-coverage': {
            name: "Cash Interest Coverage Ratio",
            desc: "Kemampuan membayar bunga menggunakan arus kas operasional (lebih akurat dari EBIT).",
            inputs: [{ id: "sol_ocf", label: "Arus Kas Operasional" }, { id: "sol_interest_paid", label: "Bunga yang Dibayar" }],
            formula: (v) => ((v.sol_ocf + v.sol_interest_paid) / v.sol_interest_paid), unit: 'x'
        },
        'fixed-charge-coverage': {
            name: "Fixed Charge Coverage Ratio",
            desc: "Kemampuan membayar beban tetap (bunga + sewa/lease).",
            inputs: [{ id: "sol_ebit", label: "EBIT" }, { id: "sol_lease", label: "Beban Sewa/Lease" }, { id: "sol_interest", label: "Beban Bunga" }],
            formula: (v) => ((v.sol_ebit + v.sol_lease) / (v.sol_interest + v.sol_lease)), unit: 'x'
        },
        'dscr': {
            name: "Debt Service Coverage Ratio (DSCR)",
            desc: "Kemampuan pendapatan operasi bersih menutupi total kewajiban utang (pokok + bunga).",
            inputs: [{ id: "sol_noi", label: "Net Operating Income (NOI)" }, { id: "sol_total_debt_service", label: "Total Debt Service (Pokok + Bunga)" }],
            formula: (v) => (v.sol_noi / v.sol_total_debt_service), unit: 'x'
        },

        // --- 4. Arus Kas vs Utang ---
        'ocf-to-total-debt': {
            name: "Operating Cash Flow to Total Debt",
            desc: "Kemampuan melunasi seluruh utang dengan arus kas operasional tahunan.",
            inputs: [{ id: "sol_ocf", label: "Arus Kas Operasional" }, { id: "sol_total_debt", label: "Total Utang" }],
            formula: (v) => (v.sol_ocf / v.sol_total_debt) * 100, unit: '%'
        },
        'ocf-to-lt-debt': {
            name: "Operating Cash Flow to Long-Term Debt",
            desc: "Kemampuan melunasi utang jangka panjang dengan arus kas operasional.",
            inputs: [{ id: "sol_ocf", label: "Arus Kas Operasional" }, { id: "sol_lt_debt", label: "Utang Jangka Panjang" }],
            formula: (v) => (v.sol_ocf / v.sol_lt_debt) * 100, unit: '%'
        },
        'debt-to-ebitda': {
            name: "Debt to EBITDA Ratio",
            desc: "Berapa tahun waktu yang dibutuhkan untuk melunasi utang dengan EBITDA saat ini.",
            inputs: [{ id: "sol_total_debt", label: "Total Utang" }, { id: "sol_ebitda", label: "EBITDA" }],
            formula: (v) => (v.sol_total_debt / v.sol_ebitda), unit: 'Tahun'
        },

        // --- 5. Solvabilitas Umum ---
        'leverage-ratio': {
            name: "Leverage Ratio",
            desc: "Rasio aset rata-rata terhadap ekuitas rata-rata (Indikator Leverage Keuangan).",
            inputs: [{ id: "sol_avg_assets", label: "Total Aset Rata-rata" }, { id: "sol_avg_equity", label: "Total Ekuitas Rata-rata" }],
            formula: (v) => (v.sol_avg_assets / v.sol_avg_equity), unit: 'x'
        },
        'financial-leverage': {
            name: "Financial Leverage Ratio",
            desc: "Mirip Equity Multiplier, mengukur penggunaan utang untuk membeli aset.",
            inputs: [{ id: "sol_avg_assets", label: "Total Aset" }, { id: "sol_avg_equity", label: "Total Ekuitas" }],
            formula: (v) => (v.sol_avg_assets / v.sol_avg_equity), unit: 'x'
        },
        'solvency-ratio': {
            name: "Solvency Ratio",
            desc: "Kemampuan arus kas perusahaan memenuhi kewajiban jangka panjang.",
            inputs: [{ id: "sol_net_income", label: "Laba Bersih" }, { id: "sol_depreciation", label: "Depresiasi" }, { id: "sol_total_liabilities", label: "Total Liabilitas" }],
            formula: (v) => ((v.sol_net_income + v.sol_depreciation) / v.sol_total_liabilities) * 100, unit: '%'
        }
    };

    // --- EVENT LISTENER (SELECT RASIO) ---
    if (solSelect) {
        solSelect.addEventListener('change', function() {
            const selectedKey = this.value;
            const data = solvencyData[selectedKey];

            if (!data) return;

            // Update Deskripsi
            solDescription.innerHTML = `
                <div class="placeholder-content">
                    <img src="https://cdn-icons-png.flaticon.com/512/2721/2721215.png" alt="Solvency" class="placeholder-icon-img" style="width:40px; margin-bottom:10px;">
                    <h4 style="color:#333; margin:0;">${data.name}</h4>
                    <p style="font-size:0.9rem; color:#666; margin-top:5px;">${data.desc}</p>
                </div>
            `;

            // Buat Input Dinamis
            solInputsContainer.innerHTML = '';
            
            data.inputs.forEach((input, index) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'form-group fade-in-up';
                wrapper.style.animationDelay = `${index * 0.1}s`;

                const label = document.createElement('label');
                label.setAttribute('for', input.id);
                label.innerText = input.label;
                label.style.fontWeight = "600";
                label.style.marginBottom = "8px";
                label.style.display = "block";
                label.style.color = "#444";

                const inputEl = document.createElement('input');
                inputEl.id = input.id;
                
                if (input.type === 'number') {
                    inputEl.type = 'number';
                    inputEl.placeholder = "0";
                } else {
                    inputEl.type = 'text';
                    inputEl.className = 'input-nominal';
                    inputEl.placeholder = "Rp 0";
                    // Format Uang Otomatis
                    inputEl.addEventListener('input', function() {
                        let val = this.value.replace(/\./g, '');
                        this.value = formatNumberWithDots(val);
                    });
                }
                
                // Styling input
                inputEl.style.width = "100%";
                inputEl.style.padding = "12px 15px";
                inputEl.style.borderRadius = "10px";
                inputEl.style.border = "1px solid #ccc";
                inputEl.style.backgroundColor = "#fff";
                inputEl.style.fontSize = "1rem";
                inputEl.required = true;

                wrapper.appendChild(label);
                wrapper.appendChild(inputEl);
                solInputsContainer.appendChild(wrapper);
            });

            calculateSolBtn.style.display = 'flex';
            solvencyResult.style.display = 'none';
        });
    }

    // --- EVENT SUBMIT & AI ---
    if (solvencyForm) {
        solvencyForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const selectedKey = solSelect.value;
            const data = solvencyData[selectedKey];
            if (!data) return;

            // Ambil Data Input
            const inputValues = {};
            let isValid = true;

            data.inputs.forEach(inputDef => {
                const inputEl = document.getElementById(inputDef.id);
                if (inputEl) {
                    if (inputDef.type === 'number') {
                        inputValues[inputDef.id] = parseFloat(inputEl.value);
                    } else {
                        // Bersihkan titik ribuan
                        const rawVal = inputEl.value.replace(/\./g, '');
                        inputValues[inputDef.id] = parseFloat(rawVal) || 0;
                    }
                    if (isNaN(inputValues[inputDef.id])) isValid = false;
                } else {
                    isValid = false;
                }
            });

            if (!isValid) {
                alert("Mohon isi semua data dengan angka yang valid.");
                return;
            }

            // Hitung Hasil
            let resultValue = 0;
            try {
                resultValue = data.formula(inputValues);
            } catch (e) {
                console.error("Rumus Error:", e);
                resultValue = 0;
            }

            // Format Hasil Display
            let displayResult = '';
            if (!isFinite(resultValue) || isNaN(resultValue)) {
                displayResult = "Data Tidak Valid";
            } else if (data.unit === '%') {
                displayResult = resultValue.toFixed(2) + '%';
            } else if (data.unit === 'Currency') {
                displayResult = 'Rp ' + resultValue.toLocaleString('id-ID', { maximumFractionDigits: 0 });
            } else if (data.unit === 'Tahun') {
                displayResult = resultValue.toFixed(2) + ' Tahun';
            } else {
                displayResult = resultValue.toFixed(2) + 'x'; // Default kali
            }

            // UI Loading
            solvencyResult.style.display = 'block';
            solvencyResult.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div class="loading-spinner" style="margin: 0 auto 15px;"></div>
                    <p style="color: #666;">AI sedang menganalisis risiko solvabilitas...</p>
                </div>
            `;
            solvencyResult.scrollIntoView({ behavior: 'smooth' });

            // Prompt AI
            const inputsText = data.inputs.map(inp => 
                `- ${inp.label}: ${inputValues[inp.id].toLocaleString('id-ID')}`
            ).join('\n');

            const prompt = `
                Bertindaklah sebagai Analis Kredit dan Risiko Korporat. Analisis Rasio Solvabilitas berikut:
                
                **Jenis Rasio:** ${data.name}
                **Data Input:**
                ${inputsText}
                
                **Hasil Perhitungan:** ${displayResult}
                
                **Tugas:**
                1. **Status Kesehatan:** Apakah angka ${displayResult} ini menunjukkan perusahaan memiliki risiko kebangkrutan yang tinggi atau rendah? (Bandingkan dengan benchmark umum, misal DER < 1.0 biasanya aman).
                2. **Diagnosa Struktur Modal:** Apakah perusahaan terlalu bergantung pada utang (over-leveraged) atau terlalu konservatif?
                3. **Rekomendasi:** Berikan 3 strategi konkret untuk menyeimbangkan struktur modal atau meningkatkan kemampuan bayar utang jangka panjang.
                
                **ATURAN FORMAT (WAJIB):**
                - Gunakan format Markdown (bold, list).
                - **JANGAN** gunakan simbol LaTeX atau matematika rumit (seperti $, \\frac). Gunakan teks biasa.
                - Bahasa profesional, objektif, dan berorientasi pada manajemen risiko.
            `;

            // Call API
            fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
            .then(res => res.json())
            .then(apiData => {
                if (apiData.candidates && apiData.candidates[0].content) {
                    const aiResponse = marked.parse(apiData.candidates[0].content.parts[0].text);
                    
                    solvencyResult.innerHTML = `
                        <div class="result-card fade-in">
                            <div class="result-header" style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                                <span style="text-transform: uppercase; letter-spacing: 1px; color: #888; font-size: 0.9rem;">Tingkat Solvabilitas</span>
                                <h1 class="text-gradient-emerald" style="font-size: 4rem; font-weight: 800; margin: 10px 0;">
                                    ${displayResult}
                                </h1>
                                <span style="font-size: 1.2rem; color: #555; font-weight: 500;">${data.name}</span>
                            </div>
                            <div class="ai-analysis-content" style="line-height: 1.8; color: #444; font-size: 1.05rem;">
                                ${aiResponse}
                            </div>
                        </div>
                    `;
                } else {
                    solvencyResult.innerHTML = '<p class="error">Gagal mendapatkan analisis AI.</p>';
                }
            })
            .catch(err => {
                console.error(err);
                solvencyResult.innerHTML = '<p class="error">Terjadi kesalahan koneksi.</p>';
            });
        });
    }
    // ===== ACTIVITY RATIO CALCULATOR (FULL SUITE) =====

    const actSelect = document.getElementById('act-ratio-type');
    const actInputsContainer = document.getElementById('act-dynamic-inputs');
    const actDescription = document.getElementById('act-ratio-description');
    const calculateActBtn = document.getElementById('calculate-act-btn');
    const activityForm = document.getElementById('activity-form');
    const activityResult = document.getElementById('activity-result');

    // Helper Format Angka
    function formatNumberWithDots(number) {
        return number.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // --- DATABASE RASIO AKTIVITAS (UNIQUE IDs: act_*) ---
    const activityData = {
        // --- 1. Perputaran Aset ---
        'total-asset-turnover': {
            name: "Total Asset Turnover",
            desc: "Mengukur efisiensi penggunaan total aset untuk menghasilkan penjualan.",
            inputs: [{ id: "act_sales", label: "Penjualan Bersih" }, { id: "act_total_assets", label: "Rata-rata Total Aset" }],
            formula: (v) => (v.act_sales / v.act_total_assets), unit: 'x'
        },
        'fixed-asset-turnover': {
            name: "Fixed Asset Turnover",
            desc: "Efisiensi penggunaan aset tetap (mesin, gedung) dalam menghasilkan pendapatan.",
            inputs: [{ id: "act_sales", label: "Penjualan Bersih" }, { id: "act_fixed_assets", label: "Rata-rata Aset Tetap Bersih" }],
            formula: (v) => (v.act_sales / v.act_fixed_assets), unit: 'x'
        },
        'current-asset-turnover': {
            name: "Current Asset Turnover",
            desc: "Seberapa efisien aset lancar digunakan untuk menghasilkan penjualan.",
            inputs: [{ id: "act_sales", label: "Penjualan Bersih" }, { id: "act_current_assets", label: "Rata-rata Aset Lancar" }],
            formula: (v) => (v.act_sales / v.act_current_assets), unit: 'x'
        },
        'net-asset-turnover': {
            name: "Net Asset Turnover",
            desc: "Penjualan dibandingkan dengan aset bersih (Ekuitas).",
            inputs: [{ id: "act_sales", label: "Penjualan Bersih" }, { id: "act_net_assets", label: "Rata-rata Aset Bersih" }],
            formula: (v) => (v.act_sales / v.act_net_assets), unit: 'x'
        },
        'operating-asset-turnover': {
            name: "Operating Asset Turnover",
            desc: "Pendapatan dibandingkan dengan aset yang digunakan langsung dalam operasi.",
            inputs: [{ id: "act_sales", label: "Penjualan Bersih" }, { id: "act_op_assets", label: "Aset Operasional Rata-rata" }],
            formula: (v) => (v.act_sales / v.act_op_assets), unit: 'x'
        },

        // --- 2. Modal Kerja & Persediaan ---
        'working-capital-turnover': {
            name: "Working Capital Turnover",
            desc: "Efektivitas penggunaan modal kerja untuk mendukung penjualan.",
            inputs: [{ id: "act_sales", label: "Penjualan Bersih" }, { id: "act_working_cap", label: "Rata-rata Modal Kerja" }],
            formula: (v) => (v.act_sales / v.act_working_cap), unit: 'x'
        },
        'inventory-turnover': {
            name: "Inventory Turnover",
            desc: "Berapa kali persediaan terjual dan diganti dalam satu periode.",
            inputs: [{ id: "act_cogs", label: "HPP (Cost of Goods Sold)" }, { id: "act_avg_inventory", label: "Rata-rata Persediaan" }],
            formula: (v) => (v.act_cogs / v.act_avg_inventory), unit: 'x'
        },
        'inventory-to-sales': {
            name: "Inventory to Sales Ratio",
            desc: "Persentase persediaan terhadap total penjualan.",
            inputs: [{ id: "act_inventory", label: "Total Persediaan" }, { id: "act_sales", label: "Penjualan Bersih" }],
            formula: (v) => (v.act_inventory / v.act_sales) * 100, unit: '%'
        },
        'capital-turnover': {
            name: "Capital Turnover Ratio",
            desc: "Hubungan antara penjualan dan modal yang ditanamkan.",
            inputs: [{ id: "act_sales", label: "Penjualan Bersih" }, { id: "act_capital_employed", label: "Capital Employed" }],
            formula: (v) => (v.act_sales / v.act_capital_employed), unit: 'x'
        },
        'sales-to-working-capital': {
            name: "Sales to Working Capital",
            desc: "Sama dengan Working Capital Turnover, mengukur volume bisnis vs modal kerja.",
            inputs: [{ id: "act_sales", label: "Penjualan Bersih" }, { id: "act_working_cap", label: "Modal Kerja (Aset Lancar - Liabilitas Lancar)" }],
            formula: (v) => (v.act_sales / v.act_working_cap), unit: 'x'
        },

        // --- 3. Siklus Hari & Konversi ---
        'dio': {
            name: "Days Inventory Outstanding (DIO)",
            desc: "Rata-rata hari yang dibutuhkan untuk menjual persediaan.",
            inputs: [{ id: "act_avg_inventory", label: "Rata-rata Persediaan" }, { id: "act_cogs", label: "HPP" }],
            formula: (v) => (v.act_avg_inventory / v.act_cogs) * 365, unit: 'Hari'
        },
        'dso': {
            name: "Days Sales Outstanding (DSO)",
            desc: "Rata-rata hari untuk menagih piutang dari pelanggan.",
            inputs: [{ id: "act_avg_ar", label: "Rata-rata Piutang Usaha" }, { id: "act_credit_sales", label: "Penjualan Kredit Bersih" }],
            formula: (v) => (v.act_avg_ar / v.act_credit_sales) * 365, unit: 'Hari'
        },
        'dpo': {
            name: "Days Payables Outstanding (DPO)",
            desc: "Rata-rata hari perusahaan membayar utang dagangnya.",
            inputs: [{ id: "act_avg_ap", label: "Rata-rata Utang Dagang" }, { id: "act_cogs", label: "HPP (atau Pembelian)" }],
            formula: (v) => (v.act_avg_ap / v.act_cogs) * 365, unit: 'Hari'
        },
        'ccc': {
            name: "Cash Conversion Cycle (CCC)",
            desc: "Siklus waktu uang keluar untuk bahan baku hingga kembali menjadi uang tunai.",
            inputs: [{ id: "act_dio", label: "DIO (Hari)" }, { id: "act_dso", label: "DSO (Hari)" }, { id: "act_dpo", label: "DPO (Hari)" }],
            formula: (v) => (v.act_dio + v.act_dso - v.act_dpo), unit: 'Hari'
        },
        'operating-cycle': {
            name: "Operating Cycle Ratio",
            desc: "Waktu yang dibutuhkan dari pembelian persediaan hingga penerimaan kas (tanpa dikurangi DPO).",
            inputs: [{ id: "act_dio", label: "DIO (Hari)" }, { id: "act_dso", label: "DSO (Hari)" }],
            formula: (v) => (v.act_dio + v.act_dso), unit: 'Hari'
        },

        // --- 4. Piutang & Utang ---
        'receivables-turnover': {
            name: "Receivables Turnover",
            desc: "Efektivitas perusahaan dalam menagih piutang.",
            inputs: [{ id: "act_credit_sales", label: "Penjualan Kredit Bersih" }, { id: "act_avg_ar", label: "Rata-rata Piutang" }],
            formula: (v) => (v.act_credit_sales / v.act_avg_ar), unit: 'x'
        },
        'payables-turnover': {
            name: "Payables Turnover",
            desc: "Kecepatan perusahaan membayar utang dagang.",
            inputs: [{ id: "act_purchases", label: "Total Pembelian" }, { id: "act_avg_ap", label: "Rata-rata Utang Dagang" }],
            formula: (v) => (v.act_purchases / v.act_avg_ap), unit: 'x'
        },
        'ar-to-sales': {
            name: "Accounts Receivable to Sales",
            desc: "Proporsi penjualan yang masih tertahan dalam bentuk piutang.",
            inputs: [{ id: "act_ar", label: "Total Piutang" }, { id: "act_sales", label: "Total Penjualan" }],
            formula: (v) => (v.act_ar / v.act_sales) * 100, unit: '%'
        },
        'ap-to-purchases': {
            name: "Accounts Payable to Purchases",
            desc: "Proporsi pembelian yang belum dibayar.",
            inputs: [{ id: "act_ap", label: "Total Utang Dagang" }, { id: "act_purchases", label: "Total Pembelian" }],
            formula: (v) => (v.act_ap / v.act_purchases) * 100, unit: '%'
        },

        // --- 5. Efisiensi Karyawan ---
        'revenue-per-employee': {
            name: "Revenue per Employee",
            desc: "Pendapatan yang dihasilkan rata-rata oleh satu karyawan.",
            inputs: [{ id: "act_revenue", label: "Total Pendapatan" }, { id: "act_employees", label: "Jumlah Karyawan", type: "number" }],
            formula: (v) => (v.act_revenue / v.act_employees), unit: 'Currency'
        }
    };

    // --- EVENT LISTENER (SELECT RASIO) ---
    if (actSelect) {
        actSelect.addEventListener('change', function() {
            const selectedKey = this.value;
            const data = activityData[selectedKey];

            if (!data) return;

            // Update Deskripsi
            actDescription.innerHTML = `
                <div class="placeholder-content">
                    <img src="https://cdn-icons-png.flaticon.com/512/10307/10307878.png" alt="Activity" class="placeholder-icon-img" style="width:40px; margin-bottom:10px;">
                    <h4 style="color:#333; margin:0;">${data.name}</h4>
                    <p style="font-size:0.9rem; color:#666; margin-top:5px;">${data.desc}</p>
                </div>
            `;

            // Buat Input Dinamis
            actInputsContainer.innerHTML = '';
            
            data.inputs.forEach((input, index) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'form-group fade-in-up';
                wrapper.style.animationDelay = `${index * 0.1}s`;

                const label = document.createElement('label');
                label.setAttribute('for', input.id);
                label.innerText = input.label;
                label.style.fontWeight = "600";
                label.style.marginBottom = "8px";
                label.style.display = "block";
                label.style.color = "#444";

                const inputEl = document.createElement('input');
                inputEl.id = input.id;
                
                if (input.type === 'number') {
                    inputEl.type = 'number';
                    inputEl.placeholder = "0";
                } else {
                    inputEl.type = 'text';
                    inputEl.className = 'input-nominal';
                    inputEl.placeholder = "Rp 0";
                    // Format Uang Otomatis
                    inputEl.addEventListener('input', function() {
                        let val = this.value.replace(/\./g, '');
                        this.value = formatNumberWithDots(val);
                    });
                }
                
                inputEl.style.width = "100%";
                inputEl.style.padding = "12px 15px";
                inputEl.style.borderRadius = "10px";
                inputEl.style.border = "1px solid #ccc";
                inputEl.style.backgroundColor = "#fff";
                inputEl.style.fontSize = "1rem";
                inputEl.required = true;

                wrapper.appendChild(label);
                wrapper.appendChild(inputEl);
                actInputsContainer.appendChild(wrapper);
            });

            calculateActBtn.style.display = 'flex';
            activityResult.style.display = 'none';
        });
    }

    // --- EVENT SUBMIT & AI ---
    if (activityForm) {
        activityForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const selectedKey = actSelect.value;
            const data = activityData[selectedKey];
            if (!data) return;

            // Ambil Input
            const inputValues = {};
            let isValid = true;

            data.inputs.forEach(inputDef => {
                const inputEl = document.getElementById(inputDef.id);
                if (inputEl) {
                    if (inputDef.type === 'number') {
                        inputValues[inputDef.id] = parseFloat(inputEl.value);
                    } else {
                        const rawVal = inputEl.value.replace(/\./g, '');
                        inputValues[inputDef.id] = parseFloat(rawVal) || 0;
                    }
                    if (isNaN(inputValues[inputDef.id])) isValid = false;
                } else {
                    isValid = false;
                }
            });

            if (!isValid) {
                alert("Mohon isi semua data dengan angka yang valid.");
                return;
            }

            // Hitung Hasil
            let resultValue = 0;
            try {
                resultValue = data.formula(inputValues);
            } catch (e) {
                resultValue = 0;
            }

            // Format Hasil
            let displayResult = '';
            if (!isFinite(resultValue) || isNaN(resultValue)) {
                displayResult = "Data Tidak Valid";
            } else if (data.unit === '%') {
                displayResult = resultValue.toFixed(2) + '%';
            } else if (data.unit === 'Currency') {
                displayResult = 'Rp ' + resultValue.toLocaleString('id-ID', { maximumFractionDigits: 0 });
            } else if (data.unit === 'Hari') {
                displayResult = resultValue.toFixed(1) + ' Hari';
            } else {
                displayResult = resultValue.toFixed(2) + 'x'; // Default turnover unit
            }

            // Loading UI
            activityResult.style.display = 'block';
            activityResult.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div class="loading-spinner" style="margin: 0 auto 15px;"></div>
                    <p style="color: #666;">AI sedang menganalisis efisiensi aktivitas...</p>
                </div>
            `;
            activityResult.scrollIntoView({ behavior: 'smooth' });

            // Prompt AI
            const inputsText = data.inputs.map(inp => 
                `- ${inp.label}: ${inputValues[inp.id].toLocaleString('id-ID')}`
            ).join('\n');

            const prompt = `
                Bertindaklah sebagai Konsultan Efisiensi Bisnis dan Analis Keuangan. Analisis Rasio Aktivitas berikut:
                
                **Jenis Rasio:** ${data.name}
                **Data Input:**
                ${inputsText}
                
                **Hasil Perhitungan:** ${displayResult}
                
                **Tugas:**
                1. **Evaluasi Efisiensi:** Apakah angka ${displayResult} ini menunjukkan manajemen aset yang efisien atau lambat? (Bandingkan dengan logika bisnis umum, misal Inventory Turnover tinggi berarti barang cepat laku).
                2. **Identifikasi Masalah:** Apa implikasi jika angka ini terlalu rendah/tinggi terhadap arus kas dan profitabilitas?
                3. **Rekomendasi Operasional:** Berikan 3 langkah konkret untuk mengoptimalkan perputaran ini (misal: perbaikan rantai pasok, kebijakan kredit ketat, atau manajemen stok).
                
                **ATURAN FORMAT:**
                - Gunakan format Markdown (bold, list).
                - JANGAN gunakan simbol LaTeX. Gunakan teks biasa.
                - Bahasa profesional, fokus pada efisiensi operasional.
            `;

            // Fetch API
            fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
            .then(res => res.json())
            .then(apiData => {
                if (apiData.candidates && apiData.candidates[0].content) {
                    const aiResponse = marked.parse(apiData.candidates[0].content.parts[0].text);
                    
                    activityResult.innerHTML = `
                        <div class="result-card fade-in">
                            <div class="result-header" style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                                <span style="text-transform: uppercase; letter-spacing: 1px; color: #888; font-size: 0.9rem;">Efisiensi Aktivitas</span>
                                <h1 class="text-gradient-amber" style="font-size: 4rem; font-weight: 800; margin: 10px 0;">
                                    ${displayResult}
                                </h1>
                                <span style="font-size: 1.2rem; color: #555; font-weight: 500;">${data.name}</span>
                            </div>
                            <div class="ai-analysis-content" style="line-height: 1.8; color: #444; font-size: 1.05rem;">
                                ${aiResponse}
                            </div>
                        </div>
                    `;
                } else {
                    activityResult.innerHTML = '<p class="error">Gagal mendapatkan analisis AI.</p>';
                }
            })
            .catch(err => {
                console.error(err);
                activityResult.innerHTML = '<p class="error">Terjadi kesalahan koneksi.</p>';
            });
        });
    }



// ===== CASH FLOW RATIO CALCULATOR (FULL SUITE) =====

    const cfSelect = document.getElementById('cf-ratio-type');
    const cfInputsContainer = document.getElementById('cf-dynamic-inputs');
    const cfDescription = document.getElementById('cf-ratio-description');
    const calculateCfBtn = document.getElementById('calculate-cf-btn');
    const cashflowForm = document.getElementById('cashflow-form');
    const cashflowResult = document.getElementById('cashflow-result');

    // Helper Format Angka
    function formatNumberWithDots(number) {
        return number.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // --- DATABASE RASIO ARUS KAS (UNIQUE IDs: cf_*) ---
    const cashflowData = {
        // --- 1. Likuiditas Kas ---
        'ocf-ratio': {
            name: "Operating Cash Flow Ratio",
            desc: "Kemampuan arus kas operasional membayar kewajiban lancar.",
            inputs: [{ id: "cf_ocf", label: "Arus Kas Operasional (OCF)" }, { id: "cf_cl", label: "Liabilitas Lancar" }],
            formula: (v) => (v.cf_ocf / v.cf_cl), unit: 'x'
        },
        'cf-current-liabilities': {
            name: "Cash Flow to Current Liabilities",
            desc: "Mirip dengan OCF Ratio, mengukur likuiditas jangka pendek.",
            inputs: [{ id: "cf_ocf", label: "Arus Kas Operasional" }, { id: "cf_cl", label: "Liabilitas Lancar" }],
            formula: (v) => (v.cf_ocf / v.cf_cl), unit: 'x'
        },
        'cf-coverage': {
            name: "Cash Flow Coverage Ratio",
            desc: "Kemampuan arus kas menutup utang yang akan jatuh tempo.",
            inputs: [{ id: "cf_ocf", label: "Arus Kas Operasional" }, { id: "cf_debt_due", label: "Utang Jatuh Tempo (1 Tahun)" }],
            formula: (v) => (v.cf_ocf / v.cf_debt_due), unit: 'x'
        },
        'dscr': {
            name: "Debt Service Coverage Ratio (DSCR)",
            desc: "Ketersediaan kas untuk membayar layanan utang (pokok + bunga).",
            inputs: [{ id: "cf_noi", label: "Net Operating Income (NOI)" }, { id: "cf_debt_service", label: "Total Debt Service" }],
            formula: (v) => (v.cf_noi / v.cf_debt_service), unit: 'x'
        },
        'cash-interest-coverage': {
            name: "Cash Interest Coverage Ratio",
            desc: "Kemampuan membayar bunga dengan uang tunai riil (bukan akrual).",
            inputs: [{ id: "cf_ocf", label: "Arus Kas Operasional" }, { id: "cf_interest", label: "Bunga Dibayar" }, { id: "cf_tax", label: "Pajak Dibayar" }],
            formula: (v) => ((v.cf_ocf + v.cf_interest + v.cf_tax) / v.cf_interest), unit: 'x'
        },

        // --- 2. Utang & Leverage ---
        'ocf-total-debt': {
            name: "OCF to Total Debt",
            desc: "Proporsi total utang yang bisa dilunasi OCF dalam satu tahun.",
            inputs: [{ id: "cf_ocf", label: "Arus Kas Operasional" }, { id: "cf_total_debt", label: "Total Utang" }],
            formula: (v) => (v.cf_ocf / v.cf_total_debt) * 100, unit: '%'
        },
        'ocf-lt-debt': {
            name: "OCF to Long-Term Debt",
            desc: "Kemampuan membayar utang jangka panjang dengan arus kas.",
            inputs: [{ id: "cf_ocf", label: "Arus Kas Operasional" }, { id: "cf_lt_debt", label: "Utang Jangka Panjang" }],
            formula: (v) => (v.cf_ocf / v.cf_lt_debt) * 100, unit: '%'
        },
        'cash-adequacy': {
            name: "Cash Adequacy Ratio",
            desc: "Kecukupan kas untuk menutup pengeluaran modal, dividen, dan utang (5 tahun).",
            inputs: [{ id: "cf_sum_ocf", label: "Total OCF (5 Tahun)" }, { id: "cf_sum_uses", label: "Total Capex + Dividen + Bayar Utang (5 Thn)" }],
            formula: (v) => (v.cf_sum_ocf / v.cf_sum_uses), unit: 'x'
        },

        // --- 3. Free Cash Flow ---
        'fcf-ratio': {
            name: "Free Cash Flow Ratio",
            desc: "Rasio arus kas bebas terhadap arus kas operasional.",
            inputs: [{ id: "cf_fcf", label: "Free Cash Flow" }, { id: "cf_ocf", label: "Arus Kas Operasional" }],
            formula: (v) => (v.cf_fcf / v.cf_ocf) * 100, unit: '%'
        },
        'fcff': {
            name: "Free Cash Flow to Firm (FCFF)",
            desc: "Kas yang tersedia untuk seluruh penyedia modal (utang & ekuitas).",
            // Rumus: EBIT(1-t) + Dep - Capex - Change WC
            inputs: [
                { id: "cf_nopat", label: "NOPAT (EBIT x (1-Tax))" },
                { id: "cf_dep", label: "Depresiasi & Amortisasi" },
                { id: "cf_capex", label: "Capital Expenditure (Capex)" },
                { id: "cf_wc_change", label: "Perubahan Modal Kerja (Delta WC)" }
            ],
            formula: (v) => (v.cf_nopat + v.cf_dep - v.cf_capex - v.cf_wc_change), unit: 'Currency'
        },
        'fcfe': {
            name: "Free Cash Flow to Equity (FCFE)",
            desc: "Kas yang tersedia khusus untuk pemegang saham setelah utang.",
            // Rumus: NI + Dep - Capex - Change WC + Net Borrowing
            inputs: [
                { id: "cf_ni", label: "Laba Bersih (Net Income)" },
                { id: "cf_dep", label: "Depresiasi & Amortisasi" },
                { id: "cf_capex", label: "Capital Expenditure" },
                { id: "cf_wc_change", label: "Perubahan Modal Kerja" },
                { id: "cf_net_borrowing", label: "Pinjaman Bersih (Utang Baru - Bayar Utang)" }
            ],
            formula: (v) => (v.cf_ni + v.cf_dep - v.cf_capex - v.cf_wc_change + v.cf_net_borrowing), unit: 'Currency'
        },
        'fcf-yield': {
            name: "Free Cash Flow Yield",
            desc: "FCF per lembar saham dibagi harga saham, atau FCF dibagi Market Cap.",
            inputs: [{ id: "cf_fcf", label: "Free Cash Flow" }, { id: "cf_market_cap", label: "Kapitalisasi Pasar" }],
            formula: (v) => (v.cf_fcf / v.cf_market_cap) * 100, unit: '%'
        },

        // --- 4. Efisiensi ---
        'cf-margin': {
            name: "Cash Flow Margin",
            desc: "Seberapa efisien penjualan dikonversi menjadi uang tunai.",
            inputs: [{ id: "cf_ocf", label: "Arus Kas Operasional" }, { id: "cf_sales", label: "Penjualan Bersih" }],
            formula: (v) => (v.cf_ocf / v.cf_sales) * 100, unit: '%'
        },
        'croa': {
            name: "Cash Return on Assets (CROA)",
            desc: "Pengembalian tunai atas aset perusahaan.",
            inputs: [{ id: "cf_ocf", label: "Arus Kas Operasional" }, { id: "cf_assets", label: "Total Aset Rata-rata" }],
            formula: (v) => (v.cf_ocf / v.cf_assets) * 100, unit: '%'
        },
        'croe': {
            name: "Cash Return on Equity (CROE)",
            desc: "Pengembalian tunai atas ekuitas pemegang saham.",
            inputs: [{ id: "cf_ocf", label: "Arus Kas Operasional" }, { id: "cf_equity", label: "Ekuitas Rata-rata" }],
            formula: (v) => (v.cf_ocf / v.cf_equity) * 100, unit: '%'
        },
        'croic': {
            name: "Cash Return on Invested Capital (CROIC)",
            desc: "Pengembalian tunai atas modal yang diinvestasikan.",
            inputs: [{ id: "cf_fcf", label: "Free Cash Flow" }, { id: "cf_inv_capital", label: "Invested Capital (Equity + Debt)" }],
            formula: (v) => (v.cf_fcf / v.cf_inv_capital) * 100, unit: '%'
        },
        'cf-sales': {
            name: "Cash Flow to Sales Ratio",
            desc: "Persentase setiap rupiah penjualan yang menjadi kas operasi.",
            inputs: [{ id: "cf_ocf", label: "Arus Kas Operasional" }, { id: "cf_sales", label: "Penjualan Bersih" }],
            formula: (v) => (v.cf_ocf / v.cf_sales) * 100, unit: '%'
        },
        'cf-net-income': {
            name: "Cash Flow to Net Income",
            desc: "Indikator kualitas laba. Rasio > 1 menunjukkan laba berkualitas tinggi.",
            inputs: [{ id: "cf_ocf", label: "Arus Kas Operasional" }, { id: "cf_ni", label: "Laba Bersih" }],
            formula: (v) => (v.cf_ocf / v.cf_ni), unit: 'x'
        },

        // --- 5. Investasi & Capex ---
        'cf-capex': {
            name: "Cash Flow to CapEx Ratio",
            desc: "Kemampuan perusahaan membiayai aset modal dari kas internal.",
            inputs: [{ id: "cf_ocf", label: "Arus Kas Operasional" }, { id: "cf_capex", label: "Capital Expenditure" }],
            formula: (v) => (v.cf_ocf / v.cf_capex), unit: 'x'
        },
        'reinvestment-ratio': {
            name: "Reinvestment Ratio",
            desc: "Seberapa banyak OCF yang ditanamkan kembali ke aset.",
            inputs: [{ id: "cf_ocf", label: "Arus Kas Operasional" }, { id: "cf_capex", label: "Capex" }, { id: "cf_assets", label: "Total Aset" }],
            formula: (v) => ((v.cf_ocf - v.cf_capex) / v.cf_assets) * 100, unit: '%'
        },
        'ocf-per-share': {
            name: "Operating Cash Flow per Share",
            desc: "Arus kas operasi yang dihasilkan per lembar saham.",
            inputs: [{ id: "cf_ocf", label: "Arus Kas Operasional" }, { id: "cf_pref_div", label: "Dividen Saham Preferen" }, { id: "cf_shares", label: "Jumlah Saham Beredar", type: "number" }],
            formula: (v) => ((v.cf_ocf - v.cf_pref_div) / v.cf_shares), unit: 'Currency'
        }
    };

    // --- EVENT LISTENER (SELECT RASIO) ---
    if (cfSelect) {
        cfSelect.addEventListener('change', function() {
            const selectedKey = this.value;
            const data = cashflowData[selectedKey];

            if (!data) return;

            // Update Deskripsi
            cfDescription.innerHTML = `
                <div class="placeholder-content">
                    <img src="https://cdn-icons-png.flaticon.com/512/2454/2454282.png" alt="Cash Flow" class="placeholder-icon-img" style="width:40px; margin-bottom:10px;">
                    <h4 style="color:#333; margin:0;">${data.name}</h4>
                    <p style="font-size:0.9rem; color:#666; margin-top:5px;">${data.desc}</p>
                </div>
            `;

            // Buat Input Dinamis
            cfInputsContainer.innerHTML = '';
            
            data.inputs.forEach((input, index) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'form-group fade-in-up';
                wrapper.style.animationDelay = `${index * 0.1}s`;

                const label = document.createElement('label');
                label.setAttribute('for', input.id);
                label.innerText = input.label;
                label.style.fontWeight = "600";
                label.style.marginBottom = "8px";
                label.style.display = "block";
                label.style.color = "#444";

                const inputEl = document.createElement('input');
                inputEl.id = input.id;
                
                if (input.type === 'number') {
                    inputEl.type = 'number';
                    inputEl.placeholder = "0";
                } else {
                    inputEl.type = 'text';
                    inputEl.className = 'input-nominal';
                    inputEl.placeholder = "Rp 0";
                    // Format Uang Otomatis
                    inputEl.addEventListener('input', function() {
                        let val = this.value.replace(/\./g, '');
                        this.value = formatNumberWithDots(val);
                    });
                }
                
                inputEl.style.width = "100%";
                inputEl.style.padding = "12px 15px";
                inputEl.style.borderRadius = "10px";
                inputEl.style.border = "1px solid #ccc";
                inputEl.style.backgroundColor = "#fff";
                inputEl.style.fontSize = "1rem";
                inputEl.required = true;

                wrapper.appendChild(label);
                wrapper.appendChild(inputEl);
                cfInputsContainer.appendChild(wrapper);
            });

            calculateCfBtn.style.display = 'flex';
            cashflowResult.style.display = 'none';
        });
    }

    // --- EVENT SUBMIT & AI ---
    if (cashflowForm) {
        cashflowForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const selectedKey = cfSelect.value;
            const data = cashflowData[selectedKey];
            if (!data) return;

            // Ambil Input
            const inputValues = {};
            let isValid = true;

            data.inputs.forEach(inputDef => {
                const inputEl = document.getElementById(inputDef.id);
                if (inputEl) {
                    if (inputDef.type === 'number') {
                        inputValues[inputDef.id] = parseFloat(inputEl.value);
                    } else {
                        const rawVal = inputEl.value.replace(/\./g, '');
                        inputValues[inputDef.id] = parseFloat(rawVal) || 0;
                    }
                    if (isNaN(inputValues[inputDef.id])) isValid = false;
                } else {
                    isValid = false;
                }
            });

            if (!isValid) {
                alert("Mohon isi semua data dengan angka yang valid.");
                return;
            }

            // Hitung
            let resultValue = 0;
            try {
                resultValue = data.formula(inputValues);
            } catch (e) {
                console.error(e);
                resultValue = 0;
            }

            // Format Hasil
            let displayResult = '';
            if (!isFinite(resultValue) || isNaN(resultValue)) {
                displayResult = "Data Tidak Valid";
            } else if (data.unit === '%') {
                displayResult = resultValue.toFixed(2) + '%';
            } else if (data.unit === 'Currency') {
                displayResult = 'Rp ' + resultValue.toLocaleString('id-ID', { maximumFractionDigits: 0 });
            } else {
                displayResult = resultValue.toFixed(2) + 'x'; 
            }

            // Loading UI
            cashflowResult.style.display = 'block';
            cashflowResult.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div class="loading-spinner" style="margin: 0 auto 15px;"></div>
                    <p style="color: #666;">AI sedang menganalisis arus kas...</p>
                </div>
            `;
            cashflowResult.scrollIntoView({ behavior: 'smooth' });

            // Prompt AI
            const inputsText = data.inputs.map(inp => 
                `- ${inp.label}: ${inputValues[inp.id].toLocaleString('id-ID')}`
            ).join('\n');

            const prompt = `
                Bertindaklah sebagai Konsultan Keuangan dan Analis Arus Kas. Analisis Rasio berikut:
                
                **Jenis Rasio:** ${data.name}
                **Data Input:**
                ${inputsText}
                
                **Hasil Perhitungan:** ${displayResult}
                
                **Tugas:**
                1. **Evaluasi Likuiditas Tunai:** Apakah angka ${displayResult} menunjukkan perusahaan memiliki kas yang cukup untuk operasional dan utang?
                2. **Kualitas Pendapatan:** (Jika relevan) Apakah laba perusahaan didukung oleh uang tunai nyata atau hanya di atas kertas?
                3. **Rekomendasi Strategis:** Berikan 3 langkah untuk meningkatkan arus kas operasional atau efisiensi penggunaan kas.
                
                **ATURAN FORMAT:**
                - Gunakan format Markdown (bold, list).
                - **JANGAN** gunakan simbol LaTeX. Gunakan teks biasa.
                - Bahasa profesional, fokus pada cash flow management.
            `;

            // Fetch API
            fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
            .then(res => res.json())
            .then(apiData => {
                if (apiData.candidates && apiData.candidates[0].content) {
                    const aiResponse = marked.parse(apiData.candidates[0].content.parts[0].text);
                    
                    cashflowResult.innerHTML = `
                        <div class="result-card fade-in">
                            <div class="result-header" style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                                <span style="text-transform: uppercase; letter-spacing: 1px; color: #888; font-size: 0.9rem;">Kinerja Arus Kas</span>
                                <h1 class="text-gradient-flow" style="font-size: 4rem; font-weight: 800; margin: 10px 0;">
                                    ${displayResult}
                                </h1>
                                <span style="font-size: 1.2rem; color: #555; font-weight: 500;">${data.name}</span>
                            </div>
                            <div class="ai-analysis-content" style="line-height: 1.8; color: #444; font-size: 1.05rem;">
                                ${aiResponse}
                            </div>
                        </div>
                    `;
                } else {
                    cashflowResult.innerHTML = '<p class="error">Gagal mendapatkan analisis AI.</p>';
                }
            })
            .catch(err => {
                console.error(err);
                cashflowResult.innerHTML = '<p class="error">Terjadi kesalahan koneksi.</p>';
            });
        });
    }
// ===== OTHER FINANCIAL CALCULATOR (VALUATION & INVESTMENT) =====

    const othSelect = document.getElementById('oth-calc-type');
    const othInputsContainer = document.getElementById('oth-dynamic-inputs');
    const othDescription = document.getElementById('oth-description');
    const calculateOthBtn = document.getElementById('calculate-oth-btn');
    const othForm = document.getElementById('other-calc-form');
    const othResult = document.getElementById('other-calc-result');

    // Helper Format Angka
    function formatNumberWithDots(number) {
        return number.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // --- DATABASE RUMUS VALUASI (UNIQUE IDs: oth_*) ---
    const otherData = {
        // --- 1. Capital Budgeting ---
        'npv': {
            name: "Net Present Value (NPV)",
            desc: "Selisih antara nilai sekarang dari arus kas masuk dan nilai sekarang dari arus kas keluar.",
            inputs: [
                { id: "oth_pv_inflows", label: "Total PV Arus Kas Masuk" }, 
                { id: "oth_initial_invest", label: "Investasi Awal" }
            ],
            formula: (v) => (v.oth_pv_inflows - v.oth_initial_invest), unit: 'Currency'
        },
        'payback-period': {
            name: "Payback Period (PP)",
            desc: "Waktu yang dibutuhkan untuk menutup kembali modal investasi awal.",
            inputs: [
                { id: "oth_invest", label: "Nilai Investasi Awal" }, 
                { id: "oth_annual_cf", label: "Rata-rata Arus Kas Tahunan" }
            ],
            formula: (v) => (v.oth_invest / v.oth_annual_cf), unit: 'Tahun'
        },
        'discounted-pp': {
            name: "Discounted Payback Period",
            desc: "Periode pengembalian modal dengan memperhitungkan nilai waktu uang (PV Cash Flow).",
            inputs: [
                { id: "oth_invest", label: "Nilai Investasi Awal" }, 
                { id: "oth_discounted_cf", label: "Rata-rata Arus Kas Terdiskonto Tahunan" }
            ],
            formula: (v) => (v.oth_invest / v.oth_discounted_cf), unit: 'Tahun'
        },
        'profitability-index': {
            name: "Profitability Index (PI)",
            desc: "Rasio antara nilai sekarang arus kas masuk masa depan dengan investasi awal.",
            inputs: [
                { id: "oth_pv_flows", label: "PV Arus Kas Masa Depan" }, 
                { id: "oth_initial_invest", label: "Investasi Awal" }
            ],
            formula: (v) => (v.oth_pv_flows / v.oth_initial_invest), unit: 'x'
        },
        'arr': {
            name: "Accounting Rate of Return (ARR)",
            desc: "Rata-rata laba akuntansi tahunan dibagi dengan investasi awal.",
            inputs: [
                { id: "oth_avg_profit", label: "Rata-rata Laba Tahunan" }, 
                { id: "oth_avg_invest", label: "Rata-rata Nilai Investasi" }
            ],
            formula: (v) => (v.oth_avg_profit / v.oth_avg_invest) * 100, unit: '%'
        },
        'npv-per-unit': {
            name: "NPV per Unit of Investment",
            desc: "Mengukur nilai tambah yang dihasilkan per satu unit mata uang investasi.",
            inputs: [
                { id: "oth_npv", label: "Net Present Value (NPV)" }, 
                { id: "oth_invest", label: "Investasi Awal" }
            ],
            formula: (v) => (v.oth_npv / v.oth_invest), unit: 'x'
        },
        'capital-recovery': {
            name: "Capital Recovery Period",
            desc: "Waktu untuk memulihkan modal, seringkali identik dengan Payback Period.",
            inputs: [
                { id: "oth_invest", label: "Investasi Awal" }, 
                { id: "oth_cash_flow", label: "Arus Kas Masuk Tahunan" }
            ],
            formula: (v) => (v.oth_invest / v.oth_cash_flow), unit: 'Tahun'
        },
        'irr-proxy': {
            name: "IRR (Simple Proxy)",
            desc: "Estimasi tingkat pengembalian internal sederhana (ROI Tahunan).",
            inputs: [
                { id: "oth_end_value", label: "Nilai Akhir / Total Arus Kas" }, 
                { id: "oth_start_value", label: "Investasi Awal" },
                { id: "oth_years", label: "Jangka Waktu (Tahun)", type: "number" }
            ],
            // CAGR Formula as proxy
            formula: (v) => (Math.pow((v.oth_end_value / v.oth_start_value), (1 / v.oth_years)) - 1) * 100, unit: '%'
        },
        'mirr': {
            name: "Modified IRR (MIRR Estimation)",
            desc: "Estimasi MIRR menggunakan Terminal Value dan Investasi Awal.",
            inputs: [
                { id: "oth_tv", label: "Terminal Value (Reinvestment)" }, 
                { id: "oth_pv_cost", label: "PV Biaya Investasi" },
                { id: "oth_n", label: "Jumlah Periode (n)", type: "number" }
            ],
            formula: (v) => (Math.pow((v.oth_tv / v.oth_pv_cost), (1 / v.oth_n)) - 1) * 100, unit: '%'
        },
        'eaa': {
            name: "Equivalent Annual Annuity (EAA)",
            desc: "Arus kas tahunan konstan yang dihasilkan proyek selama umurnya.",
            inputs: [
                { id: "oth_npv", label: "Net Present Value (NPV)" }, 
                { id: "oth_annuity_factor", label: "Faktor Anuitas (PVIF)" }
            ],
            formula: (v) => (v.oth_npv / v.oth_annuity_factor), unit: 'Currency'
        },

        // --- 2. Economic & Value ---
        'eva': {
            name: "Economic Value Added (EVA)",
            desc: "Laba operasional dikurangi biaya modal yang digunakan.",
            inputs: [
                { id: "oth_nopat", label: "NOPAT (Net Operating Profit After Tax)" }, 
                { id: "oth_capital", label: "Total Invested Capital" },
                { id: "oth_wacc", label: "WACC (%)", type: "number" }
            ],
            formula: (v) => (v.oth_nopat - (v.oth_capital * (v.oth_wacc / 100))), unit: 'Currency'
        },
        'mva': {
            name: "Market Value Added (MVA)",
            desc: "Selisih antara nilai pasar perusahaan dengan modal yang ditanamkan.",
            inputs: [
                { id: "oth_market_value", label: "Nilai Pasar Perusahaan (Market Cap)" }, 
                { id: "oth_book_value", label: "Nilai Buku Modal (Book Value)" }
            ],
            formula: (v) => (v.oth_market_value - v.oth_book_value), unit: 'Currency'
        },
        'bcr': {
            name: "Benefit–Cost Ratio (BCR)",
            desc: "Rasio total manfaat terhadap total biaya.",
            inputs: [
                { id: "oth_benefits", label: "PV Total Manfaat" }, 
                { id: "oth_costs", label: "PV Total Biaya" }
            ],
            formula: (v) => (v.oth_benefits / v.oth_costs), unit: 'x'
        },

        // --- 3. Risk & Strategic ---
        'break-even-financial': {
            name: "Financial Break-Even Point",
            desc: "Jumlah pendapatan yang diperlukan untuk menutup biaya tetap dan variabel.",
            inputs: [
                { id: "oth_fixed_cost", label: "Biaya Tetap Total" }, 
                { id: "oth_cm_ratio", label: "Rasio Margin Kontribusi (%)", type: "number" }
            ],
            formula: (v) => (v.oth_fixed_cost / (v.oth_cm_ratio / 100)), unit: 'Currency'
        },
        'tco': {
            name: "Total Cost of Ownership (TCO)",
            desc: "Total biaya aset dari pembelian hingga pembuangan.",
            inputs: [
                { id: "oth_purchase_price", label: "Harga Beli" }, 
                { id: "oth_operating_cost", label: "Biaya Operasional (Selama Umur Aset)" },
                { id: "oth_salvage_value", label: "Nilai Sisa (Salvage Value)" }
            ],
            formula: (v) => (v.oth_purchase_price + v.oth_operating_cost - v.oth_salvage_value), unit: 'Currency'
        },
        'raroc': {
            name: "Risk-Adjusted Return on Capital (RAROC)",
            desc: "Pengembalian modal yang disesuaikan dengan risiko.",
            inputs: [
                { id: "oth_revenue", label: "Pendapatan" }, 
                { id: "oth_costs", label: "Biaya & Kerugian Diperkirakan" },
                { id: "oth_economic_capital", label: "Modal Ekonomi (Risk Capital)" }
            ],
            formula: (v) => ((v.oth_revenue - v.oth_costs) / v.oth_economic_capital) * 100, unit: '%'
        },
        'rov': {
            name: "Real Options Valuation (Intrinsic)",
            desc: "Nilai intrinsik opsi riil (seperti opsi ekspansi) secara sederhana.",
            inputs: [
                { id: "oth_underlying", label: "Nilai Aset Dasar (Underlying Value)" }, 
                { id: "oth_strike", label: "Harga Eksekusi (Cost to Exercise)" }
            ],
            formula: (v) => Math.max(0, v.oth_underlying - v.oth_strike), unit: 'Currency'
        }
    };

    // --- EVENT LISTENER (SELECT TYPE) ---
    if (othSelect) {
        othSelect.addEventListener('change', function() {
            const selectedKey = this.value;
            const data = otherData[selectedKey];

            if (!data) return;

            // Update Deskripsi
            othDescription.innerHTML = `
                <div class="placeholder-content">
                    <img src="https://cdn-icons-png.flaticon.com/512/8176/8176424.png" alt="Strategy" class="placeholder-icon-img" style="width:40px; margin-bottom:10px;">
                    <h4 style="color:#333; margin:0;">${data.name}</h4>
                    <p style="font-size:0.9rem; color:#666; margin-top:5px;">${data.desc}</p>
                </div>
            `;

            // Buat Input Dinamis
            othInputsContainer.innerHTML = '';
            
            data.inputs.forEach((input, index) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'form-group fade-in-up';
                wrapper.style.animationDelay = `${index * 0.1}s`;

                const label = document.createElement('label');
                label.setAttribute('for', input.id);
                label.innerText = input.label;
                label.style.fontWeight = "600";
                label.style.marginBottom = "8px";
                label.style.display = "block";
                label.style.color = "#444";

                const inputEl = document.createElement('input');
                inputEl.id = input.id;
                
                if (input.type === 'number') {
                    inputEl.type = 'number';
                    inputEl.placeholder = "0";
                } else {
                    inputEl.type = 'text';
                    inputEl.className = 'input-nominal';
                    inputEl.placeholder = "Rp 0";
                    // Format Uang Otomatis
                    inputEl.addEventListener('input', function() {
                        let val = this.value.replace(/\./g, '');
                        this.value = formatNumberWithDots(val);
                    });
                }
                
                inputEl.style.width = "100%";
                inputEl.style.padding = "12px 15px";
                inputEl.style.borderRadius = "10px";
                inputEl.style.border = "1px solid #ccc";
                inputEl.style.backgroundColor = "#fff";
                inputEl.style.fontSize = "1rem";
                inputEl.required = true;

                wrapper.appendChild(label);
                wrapper.appendChild(inputEl);
                othInputsContainer.appendChild(wrapper);
            });

            calculateOthBtn.style.display = 'flex';
            othResult.style.display = 'none';
        });
    }

    // --- EVENT SUBMIT & AI ---
    if (othForm) {
        othForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const selectedKey = othSelect.value;
            const data = otherData[selectedKey];
            if (!data) return;

            // Ambil Input
            const inputValues = {};
            let isValid = true;

            data.inputs.forEach(inputDef => {
                const inputEl = document.getElementById(inputDef.id);
                if (inputEl) {
                    if (inputDef.type === 'number') {
                        inputValues[inputDef.id] = parseFloat(inputEl.value);
                    } else {
                        const rawVal = inputEl.value.replace(/\./g, '');
                        inputValues[inputDef.id] = parseFloat(rawVal) || 0;
                    }
                    if (isNaN(inputValues[inputDef.id])) isValid = false;
                } else {
                    isValid = false;
                }
            });

            if (!isValid) {
                alert("Mohon isi semua data dengan angka yang valid.");
                return;
            }

            // Hitung
            let resultValue = 0;
            try {
                resultValue = data.formula(inputValues);
            } catch (e) {
                console.error(e);
                resultValue = 0;
            }

            // Format Hasil
            let displayResult = '';
            if (!isFinite(resultValue) || isNaN(resultValue)) {
                displayResult = "Data Tidak Valid";
            } else if (data.unit === '%') {
                displayResult = resultValue.toFixed(2) + '%';
            } else if (data.unit === 'Currency') {
                displayResult = 'Rp ' + resultValue.toLocaleString('id-ID', { maximumFractionDigits: 0 });
            } else if (data.unit === 'Tahun') {
                displayResult = resultValue.toFixed(2) + ' Tahun';
            } else {
                displayResult = resultValue.toFixed(2) + 'x'; 
            }

            // Loading UI
            othResult.style.display = 'block';
            othResult.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div class="loading-spinner" style="margin: 0 auto 15px;"></div>
                    <p style="color: #666;">AI sedang menganalisis nilai investasi...</p>
                </div>
            `;
            othResult.scrollIntoView({ behavior: 'smooth' });

            // Prompt AI
            const inputsText = data.inputs.map(inp => 
                `- ${inp.label}: ${inputValues[inp.id].toLocaleString('id-ID')}`
            ).join('\n');

            const prompt = `
                Bertindaklah sebagai Konsultan Penilaian Bisnis dan Analis Investasi. Analisis perhitungan berikut:
                
                **Metode:** ${data.name}
                **Data Input:**
                ${inputsText}
                
                **Hasil Perhitungan:** ${displayResult}
                
                **Tugas:**
                1. **Interpretasi Nilai:** Apa arti angka ${displayResult} ini bagi keputusan bisnis? (Misal: NPV positif berarti proyek layak, Payback Period pendek berarti risiko rendah).
                2. **Analisis Kelayakan:** Berdasarkan standar umum, apakah hasil ini mengindikasikan "Go" (Lanjut) atau "No-Go" (Batal)?
                3. **Saran Strategis:** Faktor apa yang harus diperhatikan selain angka ini sebelum mengambil keputusan final?
                
                **ATURAN FORMAT:**
                - Gunakan format Markdown (bold, list).
                - **JANGAN** gunakan simbol LaTeX. Gunakan teks biasa.
                - Bahasa profesional, fokus pada pengambilan keputusan strategis.
            `;

            // Fetch API
            fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
            .then(res => res.json())
            .then(apiData => {
                if (apiData.candidates && apiData.candidates[0].content) {
                    const aiResponse = marked.parse(apiData.candidates[0].content.parts[0].text);
                    
                    othResult.innerHTML = `
                        <div class="result-card fade-in">
                            <div class="result-header" style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                                <span style="text-transform: uppercase; letter-spacing: 1px; color: #888; font-size: 0.9rem;">Hasil Valuasi</span>
                                <h1 class="text-gradient-violet" style="font-size: 4rem; font-weight: 800; margin: 10px 0;">
                                    ${displayResult}
                                </h1>
                                <span style="font-size: 1.2rem; color: #555; font-weight: 500;">${data.name}</span>
                            </div>
                            <div class="ai-analysis-content" style="line-height: 1.8; color: #444; font-size: 1.05rem;">
                                ${aiResponse}
                            </div>
                        </div>
                    `;
                } else {
                    othResult.innerHTML = '<p class="error">Gagal mendapatkan analisis AI.</p>';
                }
            })
            .catch(err => {
                console.error(err);
                othResult.innerHTML = '<p class="error">Terjadi kesalahan koneksi.</p>';
            });
        });
    }
// ===== RISK MANAGEMENT CALCULATOR (ALTMAN, BENEISH, ETC) =====

    const riskSelect = document.getElementById('risk-calc-type');
    const riskInputsContainer = document.getElementById('risk-dynamic-inputs');
    const riskDescription = document.getElementById('risk-description');
    const calculateRiskBtn = document.getElementById('calculate-risk-btn');
    const riskForm = document.getElementById('risk-calc-form');
    const riskResult = document.getElementById('risk-calc-result');

    // Helper Format Angka
    function formatNumberWithDots(number) {
        return number.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // --- DATABASE MODEL RISIKO (UNIQUE IDs: risk_*) ---
    const riskData = {
        // --- 1. Altman Z-Score ---
        'altman-z-score': {
            name: "Altman Z-Score",
            desc: "Prediksi risiko kebangkrutan. Z < 1.81 (Zona Bahaya), Z > 2.99 (Zona Aman).",
            inputs: [
                { id: "risk_wc", label: "Modal Kerja (Working Capital)" },
                { id: "risk_re", label: "Laba Ditahan (Retained Earnings)" },
                { id: "risk_ebit", label: "EBIT (Laba Operasional)" },
                { id: "risk_mve", label: "Nilai Pasar Ekuitas (Market Cap)" },
                { id: "risk_sales", label: "Penjualan (Sales)" },
                { id: "risk_ta", label: "Total Aset" },
                { id: "risk_tl", label: "Total Liabilitas" }
            ],
            formula: (v) => {
                const A = v.risk_wc / v.risk_ta;
                const B = v.risk_re / v.risk_ta;
                const C = v.risk_ebit / v.risk_ta;
                const D = v.risk_mve / v.risk_tl;
                const E = v.risk_sales / v.risk_ta;
                return (1.2 * A) + (1.4 * B) + (3.3 * C) + (0.6 * D) + (1.0 * E);
            }, 
            unit: 'Score'
        },

        // --- 2. Beneish M-Score ---
        'beneish-m-score': {
            name: "Beneish M-Score",
            desc: "Deteksi manipulasi laba. M > -1.78 mengindikasikan kemungkinan fraud tinggi.",
            // Menggunakan 5 Indeks Utama untuk penyederhanaan namun akurat
            inputs: [
                { id: "risk_dsri", label: "DSRI (Days Sales in Receivables Index)", placeholder: "Contoh: 1.05" },
                { id: "risk_gmi", label: "GMI (Gross Margin Index)", placeholder: "Contoh: 1.0" },
                { id: "risk_aqi", label: "AQI (Asset Quality Index)", placeholder: "Contoh: 1.0" },
                { id: "risk_sgi", label: "SGI (Sales Growth Index)", placeholder: "Contoh: 1.15" },
                { id: "risk_depi", label: "DEPI (Depreciation Index)", placeholder: "Contoh: 1.0" }
            ],
            // Formula Simplified 5-Var (Mempresentasikan faktor terbesar)
            // Full Model: -4.84 + 0.92*DSRI + 0.528*GMI + 0.404*AQI + 0.892*SGI + 0.115*DEPI - 0.172*SGAI + 4.679*TATA - 0.327*LVGI
            // Kita gunakan raw numbers input (angka desimal)
            formula: (v) => -4.84 + (0.92 * v.risk_dsri) + (0.528 * v.risk_gmi) + (0.404 * v.risk_aqi) + (0.892 * v.risk_sgi) + (0.115 * v.risk_depi), 
            unit: 'Score',
            type: 'index' // Marker khusus
        },

        // --- 3. Leverage ---
        'dol': {
            name: "Degree of Operating Leverage (DOL)",
            desc: "Sensitivitas laba operasi terhadap perubahan penjualan.",
            inputs: [
                { id: "risk_sales", label: "Penjualan" },
                { id: "risk_vc", label: "Total Biaya Variabel" },
                { id: "risk_fc", label: "Total Biaya Tetap" }
            ],
            // Rumus: (Sales - VC) / (Sales - VC - FC) -> CM / EBIT
            formula: (v) => (v.risk_sales - v.risk_vc) / (v.risk_sales - v.risk_vc - v.risk_fc), 
            unit: 'x'
        },
        'dfl': {
            name: "Degree of Financial Leverage (DFL)",
            desc: "Sensitivitas EPS terhadap perubahan EBIT.",
            inputs: [
                { id: "risk_ebit", label: "EBIT" },
                { id: "risk_interest", label: "Beban Bunga" }
            ],
            formula: (v) => v.risk_ebit / (v.risk_ebit - v.risk_interest), 
            unit: 'x'
        },
        'dtl': {
            name: "Degree of Total Leverage (DTL)",
            desc: "Gabungan DOL dan DFL. Risiko menyeluruh perusahaan.",
            inputs: [
                { id: "risk_dol", label: "Nilai DOL (Operating Leverage)", type: 'number' },
                { id: "risk_dfl", label: "Nilai DFL (Financial Leverage)", type: 'number' }
            ],
            formula: (v) => v.risk_dol * v.risk_dfl, 
            unit: 'x'
        },

        // --- 4. Piotroski F-Score (Checklist) ---
        'piotroski-f-score': {
            name: "Piotroski F-Score",
            desc: "Skor 0-9 menilai kekuatan finansial. Skor 8-9 sangat kuat.",
            inputs: [
                { id: "risk_f1", label: "Apakah Laba Bersih (ROA) Positif?", type: 'select_bool' },
                { id: "risk_f2", label: "Apakah Arus Kas Operasi (CFO) Positif?", type: 'select_bool' },
                { id: "risk_f3", label: "Apakah ROA meningkat dibanding tahun lalu?", type: 'select_bool' },
                { id: "risk_f4", label: "Apakah CFO lebih besar dari Laba Bersih?", type: 'select_bool' },
                { id: "risk_f5", label: "Apakah Leverage (Utang) menurun?", type: 'select_bool' },
                { id: "risk_f6", label: "Apakah Likuiditas (Current Ratio) meningkat?", type: 'select_bool' },
                { id: "risk_f7", label: "Apakah tidak ada penerbitan saham baru?", type: 'select_bool' },
                { id: "risk_f8", label: "Apakah Gross Margin meningkat?", type: 'select_bool' },
                { id: "risk_f9", label: "Apakah Asset Turnover meningkat?", type: 'select_bool' }
            ],
            formula: (v) => {
                let score = 0;
                if(v.risk_f1 === 1) score++;
                if(v.risk_f2 === 1) score++;
                if(v.risk_f3 === 1) score++;
                if(v.risk_f4 === 1) score++;
                if(v.risk_f5 === 1) score++;
                if(v.risk_f6 === 1) score++;
                if(v.risk_f7 === 1) score++;
                if(v.risk_f8 === 1) score++;
                if(v.risk_f9 === 1) score++;
                return score;
            }, 
            unit: '/ 9'
        },

        // --- 5. Interest Rate Risk ---
        'interest-rate-risk': {
            name: "Interest Rate Risk (Gap Analysis)",
            desc: "Dampak perubahan suku bunga terhadap Pendapatan Bunga Bersih (NII).",
            inputs: [
                { id: "risk_rsa", label: "Aset Sensitif Suku Bunga (RSA)" },
                { id: "risk_rsl", label: "Liabilitas Sensitif Suku Bunga (RSL)" },
                { id: "risk_rate_change", label: "Perubahan Suku Bunga (%)", type: 'number', placeholder: "Contoh: 1 atau -0.5" }
            ],
            // Rumus: Gap * Change in Rate
            formula: (v) => (v.risk_rsa - v.risk_rsl) * (v.risk_rate_change / 100), 
            unit: 'Currency' // Change in Income
        }
    };

    // --- EVENT LISTENER (SELECT TYPE) ---
    if (riskSelect) {
        riskSelect.addEventListener('change', function() {
            const selectedKey = this.value;
            const data = riskData[selectedKey];

            if (!data) return;

            // Update Deskripsi
            riskDescription.innerHTML = `
                <div class="placeholder-content">
                    <img src="https://cdn-icons-png.flaticon.com/512/9903/9903527.png" alt="Risk" class="placeholder-icon-img" style="width:40px; margin-bottom:10px;">
                    <h4 style="color:#333; margin:0;">${data.name}</h4>
                    <p style="font-size:0.9rem; color:#666; margin-top:5px;">${data.desc}</p>
                </div>
            `;

            // Buat Input Dinamis
            riskInputsContainer.innerHTML = '';
            
            data.inputs.forEach((input, index) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'form-group fade-in-up';
                wrapper.style.animationDelay = `${index * 0.1}s`;

                const label = document.createElement('label');
                label.setAttribute('for', input.id);
                label.innerText = input.label;
                label.style.fontWeight = "600";
                label.style.marginBottom = "8px";
                label.style.display = "block";
                label.style.color = "#444";

                // Handling Tipe Input Khusus
                if (input.type === 'select_bool') {
                    // Dropdown Ya/Tidak untuk Piotroski
                    const selectEl = document.createElement('select');
                    selectEl.id = input.id;
                    selectEl.className = 'premium-select-input'; // Reuse class style
                    selectEl.style.padding = "10px";
                    
                    const optDefault = document.createElement('option');
                    optDefault.value = ""; optDefault.text = "Pilih..."; optDefault.disabled = true; optDefault.selected = true;
                    
                    const optYes = document.createElement('option');
                    optYes.value = "1"; optYes.text = "Ya / Positif / Meningkat";
                    
                    const optNo = document.createElement('option');
                    optNo.value = "0"; optNo.text = "Tidak / Negatif / Menurun";

                    selectEl.add(optDefault); selectEl.add(optYes); selectEl.add(optNo);
                    selectEl.required = true;
                    wrapper.appendChild(label);
                    wrapper.appendChild(selectEl);

                } else {
                    // Input Text/Number Standar
                    const inputEl = document.createElement('input');
                    inputEl.id = input.id;
                    
                    if (input.type === 'number') {
                        inputEl.type = 'number';
                        inputEl.step = "any";
                        inputEl.placeholder = input.placeholder || "0";
                    } else {
                        inputEl.type = 'text';
                        inputEl.className = 'input-nominal';
                        inputEl.placeholder = input.placeholder || "Rp 0";
                        // Format Uang Otomatis
                        inputEl.addEventListener('input', function() {
                            let val = this.value.replace(/\./g, '');
                            this.value = formatNumberWithDots(val);
                        });
                    }
                    
                    inputEl.style.width = "100%";
                    inputEl.style.padding = "12px 15px";
                    inputEl.style.borderRadius = "10px";
                    inputEl.style.border = "1px solid #ccc";
                    inputEl.style.backgroundColor = "#fff";
                    inputEl.style.fontSize = "1rem";
                    inputEl.required = true;
                    
                    wrapper.appendChild(label);
                    wrapper.appendChild(inputEl);
                }
                
                riskInputsContainer.appendChild(wrapper);
            });

            calculateRiskBtn.style.display = 'flex';
            riskResult.style.display = 'none';
        });
    }

    // --- EVENT SUBMIT & AI ---
    if (riskForm) {
        riskForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const selectedKey = riskSelect.value;
            const data = riskData[selectedKey];
            if (!data) return;

            // Ambil Input
            const inputValues = {};
            let isValid = true;
            let inputsText = ""; // Untuk prompt AI

            data.inputs.forEach(inputDef => {
                const inputEl = document.getElementById(inputDef.id);
                if (inputEl) {
                    if (inputDef.type === 'select_bool') {
                        if (inputEl.value === "") isValid = false;
                        inputValues[inputDef.id] = parseInt(inputEl.value);
                        // Text label untuk AI
                        const answerText = inputEl.value === "1" ? "Ya" : "Tidak";
                        inputsText += `- ${inputDef.label}: ${answerText}\n`;

                    } else if (inputDef.type === 'number') {
                        if (inputEl.value === "") isValid = false;
                        inputValues[inputDef.id] = parseFloat(inputEl.value);
                        inputsText += `- ${inputDef.label}: ${inputEl.value}\n`;

                    } else {
                        const rawVal = inputEl.value.replace(/\./g, '');
                        if (rawVal === "") isValid = false;
                        inputValues[inputDef.id] = parseFloat(rawVal) || 0;
                        inputsText += `- ${inputDef.label}: ${inputEl.value}\n`;
                    }
                } else {
                    isValid = false;
                }
            });

            if (!isValid) {
                alert("Mohon lengkapi semua data input.");
                return;
            }

            // Hitung Hasil
            let resultValue = 0;
            try {
                resultValue = data.formula(inputValues);
            } catch (e) {
                console.error(e);
                resultValue = 0;
            }

            // Format Hasil
            let displayResult = '';
            if (data.unit === 'Score' || data.unit === '/ 9') {
                displayResult = resultValue.toFixed(2) + ' ' + data.unit;
            } else if (data.unit === 'Currency') {
                displayResult = 'Rp ' + resultValue.toLocaleString('id-ID', { maximumFractionDigits: 0 });
            } else {
                displayResult = resultValue.toFixed(2) + 'x'; 
            }

            // Loading UI
            riskResult.style.display = 'block';
            riskResult.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div class="loading-spinner" style="margin: 0 auto 15px;"></div>
                    <p style="color: #666;">AI sedang mendiagnosa risiko perusahaan...</p>
                </div>
            `;
            riskResult.scrollIntoView({ behavior: 'smooth' });

            // Prompt AI
            const prompt = `
                Bertindaklah sebagai Ahli Manajemen Risiko Korporat dan Auditor Forensik. Analisis hasil berikut:
                
                **Model:** ${data.name}
                **Data Input:**
                ${inputsText}
                
                **Hasil Skor/Nilai:** ${displayResult}
                
                **Tugas:**
                1. **Interpretasi Risiko:** Apakah skor ${displayResult} ini menunjukkan perusahaan dalam bahaya (Distress/Fraud) atau aman? (Jelaskan berdasarkan threshold model ${data.name}).
                2. **Analisis Penyebab:** Berdasarkan input di atas, area mana yang menjadi kelemahan utama?
                3. **Rekomendasi Mitigasi:** Berikan 3 langkah taktis untuk menurunkan risiko ini segera.
                
                **ATURAN FORMAT:**
                - Gunakan format Markdown (bold, list).
                - **JANGAN** gunakan simbol LaTeX. Gunakan teks biasa.
                - Bahasa profesional, tegas, dan berorientasi pada penyelamatan/perbaikan.
            `;

            // Fetch API
            fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
            .then(res => res.json())
            .then(apiData => {
                if (apiData.candidates && apiData.candidates[0].content) {
                    const aiResponse = marked.parse(apiData.candidates[0].content.parts[0].text);
                    
                    riskResult.innerHTML = `
                        <div class="result-card fade-in">
                            <div class="result-header" style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                                <span style="text-transform: uppercase; letter-spacing: 1px; color: #888; font-size: 0.9rem;">Hasil Diagnosa</span>
                                <h1 class="text-gradient-risk" style="font-size: 4rem; font-weight: 800; margin: 10px 0;">
                                    ${displayResult}
                                </h1>
                                <span style="font-size: 1.2rem; color: #555; font-weight: 500;">${data.name}</span>
                            </div>
                            <div class="ai-analysis-content" style="line-height: 1.8; color: #444; font-size: 1.05rem;">
                                ${aiResponse}
                            </div>
                        </div>
                    `;
                } else {
                    riskResult.innerHTML = '<p class="error">Gagal mendapatkan analisis AI.</p>';
                }
            })
            .catch(err => {
                console.error(err);
                riskResult.innerHTML = '<p class="error">Terjadi kesalahan koneksi.</p>';
            });
        });
    }
// ===== CAPITAL STRUCTURE & WACC CALCULATOR =====


    const capSelect = document.getElementById('cap-calc-type');
    const capInputsContainer = document.getElementById('cap-dynamic-inputs');
    const capDescription = document.getElementById('cap-description');
    const calculateCapBtn = document.getElementById('calculate-cap-btn');
    const capitalForm = document.getElementById('capital-calc-form');
    const capitalResult = document.getElementById('capital-calc-result');

    // Helper Format Angka
    function formatNumberWithDots(number) {
        return number.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // --- DATABASE RUMUS CAPITAL (UNIQUE IDs: cap_*) ---
    const capitalData = {
        // --- 1. WACC ---
        'wacc': {
            name: "Weighted Average Cost of Capital (WACC)",
            desc: "Biaya rata-rata tertimbang dari seluruh sumber modal (utang dan ekuitas).",
            inputs: [
                { id: "cap_equity_val", label: "Nilai Pasar Ekuitas (E)", placeholder: "Rp (Total)" },
                { id: "cap_debt_val", label: "Nilai Pasar Utang (D)", placeholder: "Rp (Total)" },
                { id: "cap_cost_equity", label: "Biaya Ekuitas / Cost of Equity (Re)", type: "number", placeholder: "% (misal: 12)" },
                { id: "cap_cost_debt", label: "Biaya Utang Sebelum Pajak (Rd)", type: "number", placeholder: "% (misal: 8)" },
                { id: "cap_tax_rate", label: "Tarif Pajak (T)", type: "number", placeholder: "% (misal: 22)" }
            ],
            formula: (v) => {
                const E = v.cap_equity_val;
                const D = v.cap_debt_val;
                const V = E + D;
                const Re = v.cap_cost_equity / 100;
                const Rd = v.cap_cost_debt / 100;
                const T = v.cap_tax_rate / 100;
                
                // Rumus WACC: (E/V * Re) + (D/V * Rd * (1-T))
                return ((E/V * Re) + (D/V * Rd * (1-T))) * 100;
            },
            unit: '%'
        },

        // --- 2. CAPM ---
        'capm': {
            name: "CAPM (Cost of Equity)",
            desc: "Menghitung pengembalian yang diharapkan pemegang saham berdasarkan risiko.",
            inputs: [
                { id: "cap_risk_free", label: "Risk-Free Rate (Rf)", type: "number", placeholder: "% (misal: 6.5)" },
                { id: "cap_beta", label: "Beta Saham (β)", type: "number", placeholder: "Contoh: 1.2" },
                { id: "cap_market_return", label: "Expected Market Return (Rm)", type: "number", placeholder: "% (misal: 10)" }
            ],
            // Rumus: Rf + Beta * (Rm - Rf)
            formula: (v) => {
                const Rf = v.cap_risk_free;
                const Beta = v.cap_beta;
                const Rm = v.cap_market_return;
                return Rf + (Beta * (Rm - Rf));
            },
            unit: '%'
        },

        // --- 3. Cost of Debt ---
        'cost-of-debt': {
            name: "Cost of Debt (After-Tax)",
            desc: "Biaya utang efektif setelah memperhitungkan manfaat pajak (Tax Shield).",
            inputs: [
                { id: "cap_pretax_rate", label: "Suku Bunga Utang (Pre-tax)", type: "number", placeholder: "%" },
                { id: "cap_tax_rate", label: "Tarif Pajak Efektif", type: "number", placeholder: "%" }
            ],
            formula: (v) => v.cap_pretax_rate * (1 - (v.cap_tax_rate / 100)),
            unit: '%'
        },

        // --- 4. Cost of Preferred Stock ---
        'cost-preferred': {
            name: "Cost of Preferred Stock",
            desc: "Biaya modal yang berasal dari penerbitan saham preferen.",
            inputs: [
                { id: "cap_dividend", label: "Dividen per Lembar (Rp)", placeholder: "Rp" },
                { id: "cap_price", label: "Harga Pasar per Lembar (Rp)", placeholder: "Rp" }
            ],
            formula: (v) => (v.cap_dividend / v.cap_price) * 100,
            unit: '%'
        },

        // --- 5. Hamada Equation ---
        'hamada': {
            name: "Hamada Equation (Levered Beta)",
            desc: "Menghitung Beta Levered (risiko dengan utang) dari Beta Unlevered.",
            inputs: [
                { id: "cap_unlevered_beta", label: "Unlevered Beta (Asset Beta)", type: "number", placeholder: "Contoh: 0.9" },
                { id: "cap_tax_rate", label: "Tarif Pajak", type: "number", placeholder: "%" },
                { id: "cap_debt_val", label: "Total Utang (D)" },
                { id: "cap_equity_val", label: "Total Ekuitas (E)" }
            ],
            // Rumus: BetaU * [1 + (1-T)*(D/E)]
            formula: (v) => {
                const T = v.cap_tax_rate / 100;
                const ratio = v.cap_debt_val / v.cap_equity_val;
                return v.cap_unlevered_beta * (1 + ((1 - T) * ratio));
            },
            unit: 'x' // Beta is a coefficient
        },

        // --- 6. Optimal Structure Solver (Simulator) ---
        'optimal-structure': {
            name: "Target WACC (Optimal Structure Simulator)",
            desc: "Simulasi WACC berdasarkan target struktur modal baru (Target Debt/Equity).",
            inputs: [
                { id: "cap_target_cost_equity", label: "Estimasi Biaya Ekuitas pada Target", type: "number", placeholder: "%" },
                { id: "cap_target_cost_debt", label: "Estimasi Biaya Utang (After-Tax) pada Target", type: "number", placeholder: "%" },
                { id: "cap_target_equity_weight", label: "Target Bobot Ekuitas (%)", type: "number", placeholder: "% (misal: 60)" },
                { id: "cap_target_debt_weight", label: "Target Bobot Utang (%)", type: "number", placeholder: "% (misal: 40)" }
            ],
            // WACC Simpel: (We * Ke) + (Wd * Kd)
            formula: (v) => {
                const We = v.cap_target_equity_weight / 100;
                const Wd = v.cap_target_debt_weight / 100;
                // Validasi bobot 100%
                if (Math.abs((We + Wd) - 1) > 0.01) {
                    throw new Error("Total bobot harus 100%");
                }
                return (We * v.cap_target_cost_equity) + (Wd * v.cap_target_cost_debt);
            },
            unit: '%'
        }
    };

    // --- EVENT LISTENER (SELECT TYPE) ---
    if (capSelect) {
        capSelect.addEventListener('change', function() {
            const selectedKey = this.value;
            const data = capitalData[selectedKey];

            if (!data) return;

            // Update Deskripsi
            capDescription.innerHTML = `
                <div class="placeholder-content">
                    <img src="https://cdn-icons-png.flaticon.com/512/2830/2830303.png" alt="Capital" class="placeholder-icon-img" style="width:40px; margin-bottom:10px;">
                    <h4 style="color:#333; margin:0;">${data.name}</h4>
                    <p style="font-size:0.9rem; color:#666; margin-top:5px;">${data.desc}</p>
                </div>
            `;

            // Buat Input Dinamis
            capInputsContainer.innerHTML = '';
            
            data.inputs.forEach((input, index) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'form-group fade-in-up';
                wrapper.style.animationDelay = `${index * 0.1}s`;

                const label = document.createElement('label');
                label.setAttribute('for', input.id);
                label.innerText = input.label;
                label.style.fontWeight = "600";
                label.style.marginBottom = "8px";
                label.style.display = "block";
                label.style.color = "#444";

                const inputEl = document.createElement('input');
                inputEl.id = input.id;
                
                if (input.type === 'number') {
                    inputEl.type = 'number';
                    inputEl.step = "any";
                    inputEl.placeholder = input.placeholder || "0";
                } else {
                    inputEl.type = 'text';
                    inputEl.className = 'input-nominal';
                    inputEl.placeholder = input.placeholder || "Rp 0";
                    // Format Uang Otomatis
                    inputEl.addEventListener('input', function() {
                        let val = this.value.replace(/\./g, '');
                        this.value = formatNumberWithDots(val);
                    });
                }
                
                inputEl.style.width = "100%";
                inputEl.style.padding = "12px 15px";
                inputEl.style.borderRadius = "10px";
                inputEl.style.border = "1px solid #ccc";
                inputEl.style.backgroundColor = "#fff";
                inputEl.style.fontSize = "1rem";
                inputEl.required = true;

                wrapper.appendChild(label);
                wrapper.appendChild(inputEl);
                capInputsContainer.appendChild(wrapper);
            });

            calculateCapBtn.style.display = 'flex';
            capitalResult.style.display = 'none';
        });
    }

    // --- EVENT SUBMIT & AI ---
    if (capitalForm) {
        capitalForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const selectedKey = capSelect.value;
            const data = capitalData[selectedKey];
            if (!data) return;

            // Ambil Input
            const inputValues = {};
            let isValid = true;
            let inputsText = "";

            data.inputs.forEach(inputDef => {
                const inputEl = document.getElementById(inputDef.id);
                if (inputEl) {
                    if (inputDef.type === 'number') {
                        if (inputEl.value === "") isValid = false;
                        inputValues[inputDef.id] = parseFloat(inputEl.value);
                        inputsText += `- ${inputDef.label}: ${inputEl.value}\n`;
                    } else {
                        const rawVal = inputEl.value.replace(/\./g, '');
                        if (rawVal === "") isValid = false;
                        inputValues[inputDef.id] = parseFloat(rawVal) || 0;
                        inputsText += `- ${inputDef.label}: ${inputEl.value}\n`;
                    }
                } else {
                    isValid = false;
                }
            });

            if (!isValid) {
                alert("Mohon lengkapi semua data input.");
                return;
            }

            // Hitung
            let resultValue = 0;
            try {
                resultValue = data.formula(inputValues);
            } catch (e) {
                console.error(e);
                alert("Error: " + e.message);
                return;
            }

            // Format Hasil
            let displayResult = '';
            if (data.unit === '%') {
                displayResult = resultValue.toFixed(2) + '%';
            } else if (data.unit === 'x') {
                displayResult = resultValue.toFixed(2) + 'x';
            } else {
                displayResult = resultValue.toFixed(2);
            }

            // Loading UI
            capitalResult.style.display = 'block';
            capitalResult.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div class="loading-spinner" style="margin: 0 auto 15px;"></div>
                    <p style="color: #666;">AI sedang menghitung biaya modal...</p>
                </div>
            `;
            capitalResult.scrollIntoView({ behavior: 'smooth' });

            // Prompt AI
            const prompt = `
                Bertindaklah sebagai Konsultan Keuangan Korporat (CFO Advisor). Analisis perhitungan berikut:
                
                **Metode:** ${data.name}
                **Data Input:**
                ${inputsText}
                
                **Hasil Perhitungan:** ${displayResult}
                
                **Tugas:**
                1. **Interpretasi:** Jelaskan apa arti angka ${displayResult} ini bagi perusahaan. (Misal: Apakah biaya modal ini terlalu mahal/murah dibanding rata-rata industri?).
                2. **Implikasi Valuasi:** Bagaimana angka ini mempengaruhi nilai perusahaan (Valuation)?
                3. **Rekomendasi:** Berikan strategi untuk mengoptimalkan struktur modal atau menurunkan biaya modal ini.
                
                **ATURAN FORMAT:**
                - Gunakan format Markdown (bold, list).
                - **JANGAN** gunakan simbol LaTeX. Gunakan teks biasa.
                - Bahasa profesional, fokus pada efisiensi modal.
            `;

            // Fetch API
        fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
            .then(res => res.json())
            .then(apiData => {
                if (apiData.candidates && apiData.candidates[0].content) {
                    const aiResponse = marked.parse(apiData.candidates[0].content.parts[0].text);
                    
                    capitalResult.innerHTML = `
                        <div class="result-card fade-in">
                            <div class="result-header" style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                                <span style="text-transform: uppercase; letter-spacing: 1px; color: #888; font-size: 0.9rem;">Hasil Perhitungan</span>
                                <h1 class="text-gradient-capital" style="font-size: 4rem; font-weight: 800; margin: 10px 0;">
                                    ${displayResult}
                                </h1>
                                <span style="font-size: 1.2rem; color: #555; font-weight: 500;">${data.name}</span>
                            </div>
                            <div class="ai-analysis-content" style="line-height: 1.8; color: #444; font-size: 1.05rem;">
                                ${aiResponse}
                            </div>
                        </div>
                    `;
                } else {
                    capitalResult.innerHTML = '<p class="error">Gagal mendapatkan analisis AI.</p>';
                }
            })
            .catch(err => {
                console.error(err);
                capitalResult.innerHTML = '<p class="error">Terjadi kesalahan koneksi.</p>';
            });
        });
    }

    const stratSelect = document.getElementById('strat-calc-type');
    const stratInputsContainer = document.getElementById('strat-dynamic-inputs');
    const stratDescription = document.getElementById('strat-description');
    const calculateStratBtn = document.getElementById('calculate-strat-btn');
    
    // GANTI NAMA VARIABEL DI SINI AGAR TIDAK BENTROK
    const stratCalcForm = document.getElementById('strategy-calc-form'); 
    const stratCalcResult = document.getElementById('strategy-calc-result');

    // Helper Format Angka
    function formatNumberWithDots(number) {
        return number.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // --- DATABASE RUMUS STRATEGI (UNIQUE IDs: strat_*) ---
    const strategyData = {
        // --- 1. DuPont Analysis ---
        'dupont-3': {
            name: "DuPont Analysis (3-Step)",
            desc: "Memecah ROE menjadi Profit Margin, Asset Turnover, dan Leverage Keuangan.",
            inputs: [
                { id: "strat_npm", label: "Net Profit Margin (NPM)", type: "number", placeholder: "% (misal: 15)" },
                { id: "strat_ato", label: "Total Asset Turnover (TATO)", type: "number", placeholder: "kali (misal: 0.8)" },
                { id: "strat_em", label: "Equity Multiplier (Aset / Ekuitas)", type: "number", placeholder: "kali (misal: 2.0)" }
            ],
            // Rumus: NPM * TATO * EM
            formula: (v) => v.strat_npm * v.strat_ato * v.strat_em,
            unit: '%' // Result is ROE
        },
        'dupont-5': {
            name: "DuPont Analysis (5-Step)",
            desc: "Analisis ROE mendalam: Beban Pajak, Beban Bunga, Margin Operasi, Perputaran Aset, Leverage.",
            inputs: [
                { id: "strat_tax_burden", label: "Tax Burden (Net Income / EBT)", type: "number", placeholder: "Desimal (misal: 0.7)" },
                { id: "strat_int_burden", label: "Interest Burden (EBT / EBIT)", type: "number", placeholder: "Desimal (misal: 0.8)" },
                { id: "strat_op_margin", label: "Operating Margin (EBIT / Sales)", type: "number", placeholder: "% (misal: 20)" },
                { id: "strat_ato", label: "Asset Turnover (Sales / Assets)", type: "number", placeholder: "kali (misal: 1.5)" },
                { id: "strat_em", label: "Financial Leverage (Assets / Equity)", type: "number", placeholder: "kali (misal: 2)" }
            ],
            // Rumus: Tax * Int * OpMargin * ATO * EM
            formula: (v) => v.strat_tax_burden * v.strat_int_burden * v.strat_op_margin * v.strat_ato * v.strat_em,
            unit: '%' // Result is ROE
        },

        // --- 2. Growth Rates ---
        'sgr': {
            name: "Sustainable Growth Rate (SGR)",
            desc: "Pertumbuhan maksimum tanpa menambah utang baru atau ekuitas baru.",
            inputs: [
                { id: "strat_roe", label: "Return on Equity (ROE)", type: "number", placeholder: "% (misal: 15)" },
                { id: "strat_payout", label: "Dividend Payout Ratio", type: "number", placeholder: "% (misal: 40)" }
            ],
            // Rumus: (ROE * b) / (1 - (ROE * b)) dimana b = retention ratio (1 - payout)
            formula: (v) => {
                const roe = v.strat_roe / 100;
                const b = 1 - (v.strat_payout / 100); // Retention Ratio
                return ((roe * b) / (1 - (roe * b))) * 100;
            },
            unit: '%'
        },
        'igr': {
            name: "Internal Growth Rate (IGR)",
            desc: "Pertumbuhan maksimum yang dapat dicapai hanya dengan aset internal (tanpa utang luar).",
            inputs: [
                { id: "strat_roa", label: "Return on Assets (ROA)", type: "number", placeholder: "% (misal: 10)" },
                { id: "strat_payout", label: "Dividend Payout Ratio", type: "number", placeholder: "% (misal: 40)" }
            ],
            // Rumus: (ROA * b) / (1 - (ROA * b))
            formula: (v) => {
                const roa = v.strat_roa / 100;
                const b = 1 - (v.strat_payout / 100);
                return ((roa * b) / (1 - (roa * b))) * 100;
            },
            unit: '%'
        },
        'cagr': {
            name: "Compound Annual Growth Rate (CAGR)",
            desc: "Rata-rata tingkat pertumbuhan tahunan yang diperhalus selama periode tertentu.",
            inputs: [
                { id: "strat_end_val", label: "Nilai Akhir (Ending Value)", placeholder: "Rp" },
                { id: "strat_start_val", label: "Nilai Awal (Beginning Value)", placeholder: "Rp" },
                { id: "strat_years", label: "Jumlah Tahun (n)", type: "number", placeholder: "Tahun" }
            ],
            // Rumus: (End / Start)^(1/n) - 1
            formula: (v) => (Math.pow((v.strat_end_val / v.strat_start_val), (1 / v.strat_years)) - 1) * 100,
            unit: '%'
        },

        // --- 3. Estimasi Cepat ---
        'rule-of-72': {
            name: "Rule of 72",
            desc: "Estimasi cepat berapa tahun waktu yang dibutuhkan untuk menggandakan investasi.",
            inputs: [
                { id: "strat_rate", label: "Tingkat Bunga / Return Tahunan", type: "number", placeholder: "% (misal: 8)" }
            ],
            // Rumus: 72 / Rate
            formula: (v) => 72 / v.strat_rate,
            unit: 'Tahun'
        }
    };

    // --- EVENT LISTENER (SELECT TYPE) ---
    if (stratSelect) {
        stratSelect.addEventListener('change', function() {
            const selectedKey = this.value;
            const data = strategyData[selectedKey];

            if (!data) return;

            // Update Deskripsi
            stratDescription.innerHTML = `
                <div class="placeholder-content">
                    <img src="https://cdn-icons-png.flaticon.com/512/3076/3076003.png" alt="Strategy" class="placeholder-icon-img" style="width:40px; margin-bottom:10px;">
                    <h4 style="color:#333; margin:0;">${data.name}</h4>
                    <p style="font-size:0.9rem; color:#666; margin-top:5px;">${data.desc}</p>
                </div>
            `;

            // Buat Input Dinamis
            stratInputsContainer.innerHTML = '';
            
            data.inputs.forEach((input, index) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'form-group fade-in-up';
                wrapper.style.animationDelay = `${index * 0.1}s`;

                const label = document.createElement('label');
                label.setAttribute('for', input.id);
                label.innerText = input.label;
                label.style.fontWeight = "600";
                label.style.marginBottom = "8px";
                label.style.display = "block";
                label.style.color = "#444";

                const inputEl = document.createElement('input');
                inputEl.id = input.id;
                
                if (input.type === 'number') {
                    inputEl.type = 'number';
                    inputEl.step = "any";
                    inputEl.placeholder = input.placeholder || "0";
                } else {
                    inputEl.type = 'text';
                    inputEl.className = 'input-nominal';
                    inputEl.placeholder = input.placeholder || "Rp 0";
                    // Format Uang Otomatis
                    inputEl.addEventListener('input', function() {
                        let val = this.value.replace(/\./g, '');
                        this.value = formatNumberWithDots(val);
                    });
                }
                
                inputEl.style.width = "100%";
                inputEl.style.padding = "12px 15px";
                inputEl.style.borderRadius = "10px";
                inputEl.style.border = "1px solid #ccc";
                inputEl.style.backgroundColor = "#fff";
                inputEl.style.fontSize = "1rem";
                inputEl.required = true;

                wrapper.appendChild(label);
                wrapper.appendChild(inputEl);
                stratInputsContainer.appendChild(wrapper);
            });

            calculateStratBtn.style.display = 'flex';
            stratCalcResult.style.display = 'none';
        });
    }

    // --- EVENT SUBMIT & AI (MENGGUNAKAN NAMA VARIABEL BARU) ---
    if (stratCalcForm) {
        stratCalcForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const selectedKey = stratSelect.value;
            const data = strategyData[selectedKey];
            if (!data) return;

            // Ambil Input
            const inputValues = {};
            let isValid = true;
            let inputsText = "";

            data.inputs.forEach(inputDef => {
                const inputEl = document.getElementById(inputDef.id);
                if (inputEl) {
                    if (inputDef.type === 'number') {
                        if (inputEl.value === "") isValid = false;
                        inputValues[inputDef.id] = parseFloat(inputEl.value);
                        inputsText += `- ${inputDef.label}: ${inputEl.value}\n`;
                    } else {
                        const rawVal = inputEl.value.replace(/\./g, '');
                        if (rawVal === "") isValid = false;
                        inputValues[inputDef.id] = parseFloat(rawVal) || 0;
                        inputsText += `- ${inputDef.label}: ${inputEl.value}\n`;
                    }
                } else {
                    isValid = false;
                }
            });

            if (!isValid) {
                alert("Mohon lengkapi semua data input.");
                return;
            }

            // Hitung
            let resultValue = 0;
            try {
                resultValue = data.formula(inputValues);
            } catch (e) {
                console.error(e);
                alert("Error perhitungan: Cek input angka.");
                return;
            }

            // Format Hasil
            let displayResult = '';
            if (data.unit === '%') {
                displayResult = resultValue.toFixed(2) + '%';
            } else if (data.unit === 'Tahun') {
                displayResult = resultValue.toFixed(2) + ' Tahun';
            } else {
                displayResult = resultValue.toFixed(2);
            }

            // Loading UI
            stratCalcResult.style.display = 'block';
            stratCalcResult.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div class="loading-spinner" style="margin: 0 auto 15px;"></div>
                    <p style="color: #666;">AI sedang menganalisis strategi perusahaan...</p>
                </div>
            `;
            stratCalcResult.scrollIntoView({ behavior: 'smooth' });

            // Prompt AI
            const prompt = `
                Bertindaklah sebagai Chief Strategy Officer (CSO) dan Analis Keuangan Senior. Analisis hasil berikut:
                
                **Model Strategis:** ${data.name}
                **Data Input:**
                ${inputsText}
                
                **Hasil Perhitungan:** ${displayResult}
                
                **Tugas:**
                1. **Bedah Kinerja:** Jelaskan apa arti angka ${displayResult} ini? (Misal: Jika DuPont ROE rendah karena Asset Turnover, artinya efisiensi aset buruk).
                2. **Potensi vs Realita:** Apakah angka ini menunjukkan perusahaan sudah memaksimalkan potensinya?
                3. **Rekomendasi Eksekutif:** Berikan 3 inisiatif strategis tingkat tinggi untuk meningkatkan kinerja ini.
                
                **ATURAN FORMAT:**
                - Gunakan format Markdown (bold, list).
                - **JANGAN** gunakan simbol LaTeX. Gunakan teks biasa.
                - Bahasa profesional, visioner, dan strategis.
            `;

            // Fetch API
           fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
            .then(res => res.json())
            .then(apiData => {
                if (apiData.candidates && apiData.candidates[0].content) {
                    const aiResponse = marked.parse(apiData.candidates[0].content.parts[0].text);
                    
                    stratCalcResult.innerHTML = `
                        <div class="result-card fade-in">
                            <div class="result-header" style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                                <span style="text-transform: uppercase; letter-spacing: 1px; color: #888; font-size: 0.9rem;">Analisis Strategis</span>
                                <h1 class="text-gradient-strategy" style="font-size: 4rem; font-weight: 800; margin: 10px 0;">
                                    ${displayResult}
                                </h1>
                                <span style="font-size: 1.2rem; color: #555; font-weight: 500;">${data.name}</span>
                            </div>
                            <div class="ai-analysis-content" style="line-height: 1.8; color: #444; font-size: 1.05rem;">
                                ${aiResponse}
                            </div>
                        </div>
                    `;
                } else {
                    stratCalcResult.innerHTML = '<p class="error">Gagal mendapatkan analisis AI.</p>';
                }
            })
            .catch(err => {
                console.error(err);
                stratCalcResult.innerHTML = '<p class="error">Terjadi kesalahan koneksi.</p>';
            });
        });
    }

// ===== SECURITY VALUATION CALCULATOR (STOCKS & BONDS) =====

    const valSelect = document.getElementById('val-calc-type');
    const valInputsContainer = document.getElementById('val-dynamic-inputs');
    const valDescription = document.getElementById('val-description');
    const calculateValBtn = document.getElementById('calculate-val-btn');
    const valuationForm = document.getElementById('valuation-calc-form');
    const valuationResult = document.getElementById('valuation-calc-result');

    // Helper Format Angka
    function formatNumberWithDots(number) {
        return number.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // --- DATABASE MODEL VALUASI (UNIQUE IDs: val_*) ---
    const valuationData = {
        // --- 1. Stocks (Equity) ---
        'ggm': {
            name: "Dividend Discount Model (GGM)",
            desc: "Menghitung harga wajar saham asumsi pertumbuhan dividen konstan.",
            inputs: [
                { id: "val_div", label: "Dividen Tahun Depan (D1)", placeholder: "Rp (per lembar)" },
                { id: "val_cost_equity", label: "Biaya Ekuitas / Required Return (r)", type: "number", placeholder: "% (misal: 10)" },
                { id: "val_growth", label: "Laju Pertumbuhan Dividen (g)", type: "number", placeholder: "% (misal: 5)" }
            ],
            // Rumus: D1 / (r - g)
            formula: (v) => {
                const r = v.val_cost_equity / 100;
                const g = v.val_growth / 100;
                if (r <= g) throw new Error("Required Return (r) harus lebih besar dari Growth (g).");
                return v.val_div / (r - g);
            },
            unit: 'Currency'
        },
        'peg': {
            name: "PEG Ratio Calculator",
            desc: "Menentukan mahal/murahnya saham dengan membandingkan PER dan Pertumbuhan Laba.",
            inputs: [
                { id: "val_price", label: "Harga Saham Saat Ini (Price)", placeholder: "Rp" },
                { id: "val_eps", label: "Laba per Saham (EPS)", placeholder: "Rp" },
                { id: "val_earnings_growth", label: "Pertumbuhan EPS Tahunan (%)", type: "number", placeholder: "% (misal: 15)" }
            ],
            // Rumus: (Price / EPS) / Growth Rate
            formula: (v) => {
                const per = v.val_price / v.val_eps;
                return per / v.val_earnings_growth;
            },
            unit: 'x' // PEG is a ratio
        },
        'ev': {
            name: "Enterprise Value (EV)",
            desc: "Nilai total perusahaan jika diakuisisi (Market Cap + Utang - Kas).",
            inputs: [
                { id: "val_shares", label: "Jumlah Saham Beredar", type: "number", placeholder: "Lembar" },
                { id: "val_stock_price", label: "Harga Saham", placeholder: "Rp" },
                { id: "val_total_debt", label: "Total Utang (Jangka Pendek + Panjang)", placeholder: "Rp" },
                { id: "val_cash", label: "Kas dan Setara Kas", placeholder: "Rp" },
                { id: "val_minority", label: "Kepentingan Minoritas (Opsional)", placeholder: "Rp (0 jika tidak ada)" }
            ],
            // Rumus: (Shares * Price) + Debt + Minority - Cash
            formula: (v) => {
                const marketCap = v.val_shares * v.val_stock_price;
                const minority = v.val_minority || 0;
                return marketCap + v.val_total_debt + minority - v.val_cash;
            },
            unit: 'Currency'
        },

        // --- 2. Bonds (Fixed Income) ---
        'ytm': {
            name: "Bond Yield to Maturity (YTM) Estimate",
            desc: "Estimasi tingkat pengembalian obligasi jika dipegang hingga jatuh tempo.",
            inputs: [
                { id: "val_face_value", label: "Nilai Nominal (Face Value)", placeholder: "Rp (misal: 1.000.000)" },
                { id: "val_bond_price", label: "Harga Pasar Obligasi", placeholder: "Rp (misal: 950.000)" },
                { id: "val_coupon_rate", label: "Kupon Bunga Tahunan (%)", type: "number", placeholder: "%" },
                { id: "val_years", label: "Sisa Waktu Jatuh Tempo (Tahun)", type: "number", placeholder: "Tahun" }
            ],
            // Rumus Aproksimasi: (C + (F-P)/n) / ((F+P)/2)
            formula: (v) => {
                const C = v.val_face_value * (v.val_coupon_rate / 100); // Kupon Nominal
                const F = v.val_face_value;
                const P = v.val_bond_price;
                const n = v.val_years;
                
                const numerator = C + ((F - P) / n);
                const denominator = (F + P) / 2;
                return (numerator / denominator) * 100;
            },
            unit: '%'
        },
        'duration': {
            name: "Bond Duration (Modified)",
            desc: "Estimasi sensitivitas harga obligasi terhadap perubahan suku bunga 1%.",
            inputs: [
                { id: "val_ytm", label: "Yield to Maturity (YTM) Saat Ini", type: "number", placeholder: "% (misal: 8)" },
                { id: "val_coupon", label: "Kupon Tahunan (%)", type: "number", placeholder: "% (misal: 7)" },
                { id: "val_maturity", label: "Jatuh Tempo (Tahun)", type: "number", placeholder: "Tahun" }
            ],
            // Simplified Macaulay Duration formula for approximation
            formula: (v) => {
                const y = v.val_ytm / 100;
                const c = v.val_coupon / 100;
                const n = v.val_maturity;
                
                // Rumus Macaulay Duration Aproksimasi
                // D = (1+y)/y - (1+y+n*(c-y)) / (c*((1+y)^n -1) + y)
                const term1 = (1 + y) / y;
                const term2_num = (1 + y) + (n * (c - y));
                const term2_den = (c * (Math.pow(1 + y, n) - 1)) + y;
                const macaulay = term1 - (term2_num / term2_den);
                
                // Modified Duration = Macaulay / (1 + y)
                return macaulay / (1 + y);
            },
            unit: 'Tahun' // Duration is expressed in years, representing % change
        }
    };

    // --- EVENT LISTENER (SELECT TYPE) ---
    if (valSelect) {
        valSelect.addEventListener('change', function() {
            const selectedKey = this.value;
            const data = valuationData[selectedKey];

            if (!data) return;

            // Update Deskripsi
            valDescription.innerHTML = `
                <div class="placeholder-content">
                    <img src="https://cdn-icons-png.flaticon.com/512/2953/2953363.png" alt="Valuation" class="placeholder-icon-img" style="width:40px; margin-bottom:10px;">
                    <h4 style="color:#333; margin:0;">${data.name}</h4>
                    <p style="font-size:0.9rem; color:#666; margin-top:5px;">${data.desc}</p>
                </div>
            `;

            // Buat Input Dinamis
            valInputsContainer.innerHTML = '';
            
            data.inputs.forEach((input, index) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'form-group fade-in-up';
                wrapper.style.animationDelay = `${index * 0.1}s`;

                const label = document.createElement('label');
                label.setAttribute('for', input.id);
                label.innerText = input.label;
                label.style.fontWeight = "600";
                label.style.marginBottom = "8px";
                label.style.display = "block";
                label.style.color = "#444";

                const inputEl = document.createElement('input');
                inputEl.id = input.id;
                
                if (input.type === 'number') {
                    inputEl.type = 'number';
                    inputEl.step = "any";
                    inputEl.placeholder = input.placeholder || "0";
                } else {
                    inputEl.type = 'text';
                    inputEl.className = 'input-nominal';
                    inputEl.placeholder = input.placeholder || "Rp 0";
                    // Format Uang Otomatis
                    inputEl.addEventListener('input', function() {
                        let val = this.value.replace(/\./g, '');
                        this.value = formatNumberWithDots(val);
                    });
                }
                
                inputEl.style.width = "100%";
                inputEl.style.padding = "12px 15px";
                inputEl.style.borderRadius = "10px";
                inputEl.style.border = "1px solid #ccc";
                inputEl.style.backgroundColor = "#fff";
                inputEl.style.fontSize = "1rem";
                inputEl.required = true;

                wrapper.appendChild(label);
                wrapper.appendChild(inputEl);
                valInputsContainer.appendChild(wrapper);
            });

            calculateValBtn.style.display = 'flex';
            valuationResult.style.display = 'none';
        });
    }

    // --- EVENT SUBMIT & AI ---
    if (valuationForm) {
        valuationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const selectedKey = valSelect.value;
            const data = valuationData[selectedKey];
            if (!data) return;

            // Ambil Input
            const inputValues = {};
            let isValid = true;
            let inputsText = "";

            data.inputs.forEach(inputDef => {
                const inputEl = document.getElementById(inputDef.id);
                if (inputEl) {
                    if (inputDef.type === 'number') {
                        if (inputEl.value === "") isValid = false;
                        inputValues[inputDef.id] = parseFloat(inputEl.value);
                        inputsText += `- ${inputDef.label}: ${inputEl.value}\n`;
                    } else {
                        const rawVal = inputEl.value.replace(/\./g, '');
                        if (rawVal === "") isValid = false;
                        inputValues[inputDef.id] = parseFloat(rawVal) || 0;
                        inputsText += `- ${inputDef.label}: ${inputEl.value}\n`;
                    }
                } else {
                    isValid = false;
                }
            });

            if (!isValid) {
                alert("Mohon lengkapi semua data input.");
                return;
            }

            // Hitung
            let resultValue = 0;
            try {
                resultValue = data.formula(inputValues);
            } catch (e) {
                alert("Error: " + e.message);
                return;
            }

            // Format Hasil
            let displayResult = '';
            if (data.unit === 'Currency') {
                displayResult = 'Rp ' + resultValue.toLocaleString('id-ID', { maximumFractionDigits: 0 });
            } else if (data.unit === '%') {
                displayResult = resultValue.toFixed(2) + '%';
            } else if (data.unit === 'x') {
                displayResult = resultValue.toFixed(2) + 'x';
            } else if (data.unit === 'Tahun') {
                displayResult = resultValue.toFixed(2) + ' Tahun (Mod. Duration)';
            } else {
                displayResult = resultValue.toFixed(2);
            }

            // Loading UI
            valuationResult.style.display = 'block';
            valuationResult.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div class="loading-spinner" style="margin: 0 auto 15px;"></div>
                    <p style="color: #666;">AI sedang menghitung nilai wajar...</p>
                </div>
            `;
            valuationResult.scrollIntoView({ behavior: 'smooth' });

            // Prompt AI
            const prompt = `
                Bertindaklah sebagai Investment Banker dan Equity Research Analyst. Analisis hasil valuasi berikut:
                
                **Model Valuasi:** ${data.name}
                **Data Input:**
                ${inputsText}
                
                **Hasil Perhitungan:** ${displayResult}
                
                **Tugas:**
                1. **Rekomendasi Investasi:** Apakah aset ini terlihat Undervalued (Murah), Overvalued (Mahal), atau Fair Value? (Berikan logika pasar).
                2. **Analisis Sensitivitas:** Faktor input mana yang paling mempengaruhi hasil ini? (Misal: Jika yield naik, harga obligasi turun).
                3. **Risiko & Peluang:** Apa risiko utama membeli aset ini pada valuasi tersebut?
                
                **ATURAN FORMAT:**
                - Gunakan format Markdown (bold, list).
                - **JANGAN** gunakan simbol LaTeX. Gunakan teks biasa.
                - Bahasa profesional, objektif, seperti laporan riset sekuritas.
            `;

            // Fetch API
           fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
            .then(res => res.json())
            .then(apiData => {
                if (apiData.candidates && apiData.candidates[0].content) {
                    const aiResponse = marked.parse(apiData.candidates[0].content.parts[0].text);
                    
                    valuationResult.innerHTML = `
                        <div class="result-card fade-in">
                            <div class="result-header" style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                                <span style="text-transform: uppercase; letter-spacing: 1px; color: #888; font-size: 0.9rem;">Hasil Valuasi</span>
                                <h1 class="text-gradient-gold" style="font-size: 4rem; font-weight: 800; margin: 10px 0;">
                                    ${displayResult}
                                </h1>
                                <span style="font-size: 1.2rem; color: #555; font-weight: 500;">${data.name}</span>
                            </div>
                            <div class="ai-analysis-content" style="line-height: 1.8; color: #444; font-size: 1.05rem;">
                                ${aiResponse}
                            </div>
                        </div>
                    `;
                } else {
                    valuationResult.innerHTML = '<p class="error">Gagal mendapatkan analisis AI.</p>';
                }
            })
            .catch(err => {
                console.error(err);
                valuationResult.innerHTML = '<p class="error">Terjadi kesalahan koneksi.</p>';
            });
        });
    }
// ===== OPERATIONAL DECISION & FUNDING CALCULATOR =====
   const decSelect = document.getElementById('dec-calc-type');
    const decInputsContainer = document.getElementById('dec-dynamic-inputs');
    const decDescription = document.getElementById('dec-description');
    const calculateDecBtn = document.getElementById('calculate-dec-btn');
    
    // Variabel Form & Result Unik
    const decCalcForm = document.getElementById('decision-calc-form');
    const decCalcResult = document.getElementById('decision-calc-result');

    // Helper Format Angka
    function formatNumberWithDots(number) {
        return number.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // --- DATABASE RUMUS KEPUTUSAN (UNIQUE IDs: dec_*) ---
    const decisionData = {
        // --- 1. Aset & Pembiayaan ---
        'lease-vs-buy': {
            name: "Lease vs. Buy Analysis",
            desc: "Membandingkan biaya membeli aset (dengan utang) vs menyewa (leasing). Menghitung penghematan bersih.",
            inputs: [
                { id: "dec_purchase_price", label: "Harga Beli Aset", placeholder: "Rp" },
                { id: "dec_lease_pmt", label: "Biaya Sewa per Tahun", placeholder: "Rp" },
                { id: "dec_useful_life", label: "Umur Ekonomis (Tahun)", type: "number", placeholder: "Tahun" },
                { id: "dec_interest_rate", label: "Suku Bunga Pinjaman / Diskon", type: "number", placeholder: "% (misal: 10)" },
                { id: "dec_maintenance", label: "Biaya Pemeliharaan per Tahun (jika Beli)", placeholder: "Rp" },
                { id: "dec_residual", label: "Nilai Sisa Aset (Akhir Periode)", placeholder: "Rp (0 jika tidak ada)" }
            ],
            // Logic Sederhana: PV Cost of Buying vs PV Cost of Leasing
            formula: (v) => {
                const r = v.dec_interest_rate / 100;
                const n = v.dec_useful_life;
                
                // 1. Cost of Leasing (PV Annuity)
                // PV = Pmt * [(1 - (1+r)^-n) / r]
                const pv_lease = v.dec_lease_pmt * ((1 - Math.pow(1 + r, -n)) / r);
                
                // 2. Cost of Buying
                // Initial + PV Maintenance - PV Residual
                const pv_maint = v.dec_maintenance * ((1 - Math.pow(1 + r, -n)) / r);
                const pv_residual = v.dec_residual / Math.pow(1 + r, n);
                const pv_buy = v.dec_purchase_price + pv_maint - pv_residual;
                
                // Return selisih (Positif = Beli lebih murah, Negatif = Sewa lebih murah)
                return pv_lease - pv_buy; 
            },
            unit: 'CurrencyDiff' // Special handler for display
        },
        'factoring-cost': {
            name: "Factoring Cost Calculator",
            desc: "Menghitung biaya efektif tahunan dari penjualan piutang (anjak piutang).",
            inputs: [
                { id: "dec_invoice_val", label: "Nilai Faktur / Piutang", placeholder: "Rp" },
                { id: "dec_advance_rate", label: "Uang Muka Diterima (%)", type: "number", placeholder: "% (misal: 80)" },
                { id: "dec_factor_fee", label: "Biaya Factoring (%)", type: "number", placeholder: "% (misal: 2)" },
                { id: "dec_days", label: "Jangka Waktu Piutang (Hari)", type: "number", placeholder: "Hari" }
            ],
            // Biaya Nominal = (Faktur * Fee). Dana Diterima = (Faktur * Advance) - Biaya.
            // Effective Rate = (Biaya / Dana Diterima) * (365 / Hari)
            formula: (v) => {
                const fee = v.dec_invoice_val * (v.dec_factor_fee / 100);
                const advance = v.dec_invoice_val * (v.dec_advance_rate / 100);
                const received = advance - fee;
                return (fee / received) * (365 / v.dec_days) * 100;
            },
            unit: '% (APR)'
        },

        // --- 2. Manajemen Modal Kerja ---
        'trade-credit': {
            name: "Trade Credit Discount (Cost of Foregoing)",
            desc: "Biaya bunga efektif tahunan jika Anda TIDAK mengambil diskon dari supplier (misal 2/10 net 30).",
            inputs: [
                { id: "dec_discount_percent", label: "Persen Diskon", type: "number", placeholder: "% (misal: 2 untuk 2/10)" },
                { id: "dec_discount_period", label: "Periode Diskon (Hari)", type: "number", placeholder: "Hari (misal: 10)" },
                { id: "dec_full_period", label: "Jatuh Tempo Penuh (Net Days)", type: "number", placeholder: "Hari (misal: 30)" }
            ],
            // Rumus: (Disc / (100-Disc)) * (365 / (Full - DiscPeriod))
            formula: (v) => {
                const d = v.dec_discount_percent;
                const daysDiff = v.dec_full_period - v.dec_discount_period;
                return (d / (100 - d)) * (365 / daysDiff) * 100;
            },
            unit: '% (APR)'
        },

        // --- 3. Manajemen Persediaan ---
        'eoq': {
            name: "Economic Order Quantity (EOQ)",
            desc: "Jumlah pemesanan optimal yang meminimalkan total biaya pemesanan dan penyimpanan.",
            inputs: [
                { id: "dec_demand", label: "Permintaan Tahunan (Unit)", type: "number", placeholder: "Unit" },
                { id: "dec_order_cost", label: "Biaya per Pemesanan (Ordering Cost)", placeholder: "Rp" },
                { id: "dec_holding_cost", label: "Biaya Penyimpanan per Unit per Tahun", placeholder: "Rp" }
            ],
            // Rumus: sqrt((2 * D * S) / H)
            formula: (v) => Math.sqrt((2 * v.dec_demand * v.dec_order_cost) / v.dec_holding_cost),
            unit: 'Unit'
        },
        'reorder-point': {
            name: "Safety Stock & Reorder Point",
            desc: "Titik di mana stok harus dipesan ulang untuk menghindari kehabisan barang.",
            inputs: [
                { id: "dec_daily_usage", label: "Rata-rata Penggunaan Harian", type: "number", placeholder: "Unit/Hari" },
                { id: "dec_lead_time", label: "Lead Time (Waktu Tunggu Supplier)", type: "number", placeholder: "Hari" },
                { id: "dec_safety_stock", label: "Safety Stock (Stok Pengaman)", type: "number", placeholder: "Unit" }
            ],
            // Rumus: (Daily Usage * Lead Time) + Safety Stock
            formula: (v) => (v.dec_daily_usage * v.dec_lead_time) + v.dec_safety_stock,
            unit: 'Unit'
        }
    };

    // --- EVENT LISTENER (SELECT TYPE) ---
    if (decSelect) {
        decSelect.addEventListener('change', function() {
            const selectedKey = this.value;
            const data = decisionData[selectedKey];

            if (!data) return;

            // Update Deskripsi
            decDescription.innerHTML = `
                <div class="placeholder-content">
                    <img src="https://cdn-icons-png.flaticon.com/512/1570/1570917.png" alt="Decision" class="placeholder-icon-img" style="width:40px; margin-bottom:10px;">
                    <h4 style="color:#333; margin:0;">${data.name}</h4>
                    <p style="font-size:0.9rem; color:#666; margin-top:5px;">${data.desc}</p>
                </div>
            `;

            // Buat Input Dinamis
            decInputsContainer.innerHTML = '';
            
            data.inputs.forEach((input, index) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'form-group fade-in-up';
                wrapper.style.animationDelay = `${index * 0.1}s`;

                const label = document.createElement('label');
                label.setAttribute('for', input.id);
                label.innerText = input.label;
                label.style.fontWeight = "600";
                label.style.marginBottom = "8px";
                label.style.display = "block";
                label.style.color = "#444";

                const inputEl = document.createElement('input');
                inputEl.id = input.id;
                
                if (input.type === 'number') {
                    inputEl.type = 'number';
                    inputEl.step = "any";
                    inputEl.placeholder = input.placeholder || "0";
                } else {
                    inputEl.type = 'text';
                    inputEl.className = 'input-nominal';
                    inputEl.placeholder = input.placeholder || "Rp 0";
                    // Format Uang Otomatis
                    inputEl.addEventListener('input', function() {
                        let val = this.value.replace(/\./g, '');
                        this.value = formatNumberWithDots(val);
                    });
                }
                
                inputEl.style.width = "100%";
                inputEl.style.padding = "12px 15px";
                inputEl.style.borderRadius = "10px";
                inputEl.style.border = "1px solid #ccc";
                inputEl.style.backgroundColor = "#fff";
                inputEl.style.fontSize = "1rem";
                inputEl.required = true;

                wrapper.appendChild(label);
                wrapper.appendChild(inputEl);
                decInputsContainer.appendChild(wrapper);
            });

            calculateDecBtn.style.display = 'flex';
            decCalcResult.style.display = 'none';
        });
    }

    // --- EVENT SUBMIT & AI ---
    if (decCalcForm) {
        decCalcForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const selectedKey = decSelect.value;
            const data = decisionData[selectedKey];
            if (!data) return;

            // Ambil Input
            const inputValues = {};
            let isValid = true;
            let inputsText = "";

            data.inputs.forEach(inputDef => {
                const inputEl = document.getElementById(inputDef.id);
                if (inputEl) {
                    if (inputDef.type === 'number') {
                        if (inputEl.value === "") isValid = false;
                        inputValues[inputDef.id] = parseFloat(inputEl.value);
                        inputsText += `- ${inputDef.label}: ${inputEl.value}\n`;
                    } else {
                        const rawVal = inputEl.value.replace(/\./g, '');
                        if (rawVal === "") isValid = false;
                        inputValues[inputDef.id] = parseFloat(rawVal) || 0;
                        inputsText += `- ${inputDef.label}: ${inputEl.value}\n`;
                    }
                } else {
                    isValid = false;
                }
            });

            if (!isValid) {
                alert("Mohon lengkapi semua data input.");
                return;
            }

            // Hitung
            let resultValue = 0;
            try {
                resultValue = data.formula(inputValues);
            } catch (e) {
                console.error(e);
                alert("Error perhitungan: " + e.message);
                return;
            }

            // Format Hasil Display
            let displayResult = '';
            
            // Logic Khusus untuk Lease vs Buy (Menampilkan selisih)
            if (data.unit === 'CurrencyDiff') {
                const diff = Math.abs(resultValue).toLocaleString('id-ID', { maximumFractionDigits: 0 });
                if (resultValue > 0) {
                    displayResult = `MEMBELI lebih hemat Rp ${diff}`;
                } else if (resultValue < 0) {
                    displayResult = `LEASING lebih hemat Rp ${diff}`;
                } else {
                    displayResult = "Biaya Sama (Indifferent)";
                }
            } 
            else if (data.unit === 'Currency') {
                displayResult = 'Rp ' + resultValue.toLocaleString('id-ID', { maximumFractionDigits: 0 });
            } else if (data.unit === '% (APR)') {
                displayResult = resultValue.toFixed(2) + '% (Biaya Tahunan)';
            } else {
                displayResult = resultValue.toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' ' + data.unit;
            }

            // Loading UI
            decCalcResult.style.display = 'block';
            decCalcResult.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div class="loading-spinner" style="margin: 0 auto 15px;"></div>
                    <p style="color: #666;">AI sedang menganalisis keputusan operasional...</p>
                </div>
            `;
            decCalcResult.scrollIntoView({ behavior: 'smooth' });

            // Prompt AI
            const prompt = `
                Bertindaklah sebagai Direktur Operasional (COO) dan Manajer Keuangan. Analisis keputusan berikut:
                
                **Jenis Keputusan:** ${data.name}
                **Data Input:**
                ${inputsText}
                
                **Hasil Perhitungan:** ${displayResult}
                
                **Tugas:**
                1. **Rekomendasi Keputusan:** Berdasarkan hasil di atas, apa tindakan terbaik yang harus diambil? (Misal: Apakah diskon supplier itu layak diambil mengingat biayanya? Apakah jumlah pesanan EOQ realistis?).
                2. **Pertimbangan Kualitatif:** Faktor non-angka apa yang harus dipikirkan? (Misal: risiko kehabisan stok, hubungan dengan supplier, fleksibilitas cash flow).
                3. **Efisiensi:** Bagaimana keputusan ini berdampak pada efisiensi modal kerja perusahaan?
                
                **ATURAN FORMAT:**
                - Gunakan format Markdown (bold, list).
                - **JANGAN** gunakan simbol LaTeX. Gunakan teks biasa.
                - Bahasa profesional, fokus pada pengambilan keputusan taktis.
            `;

            // Fetch API
           fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
            .then(res => res.json())
            .then(apiData => {
                if (apiData.candidates && apiData.candidates[0].content) {
                    const aiResponse = marked.parse(apiData.candidates[0].content.parts[0].text);
                    
                    decCalcResult.innerHTML = `
                        <div class="result-card fade-in">
                            <div class="result-header" style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                                <span style="text-transform: uppercase; letter-spacing: 1px; color: #888; font-size: 0.9rem;">Hasil Keputusan</span>
                                <h1 class="text-gradient-decision" style="font-size: 3rem; font-weight: 800; margin: 10px 0;">
                                    ${displayResult}
                                </h1>
                                <span style="font-size: 1.2rem; color: #555; font-weight: 500;">${data.name}</span>
                            </div>
                            <div class="ai-analysis-content" style="line-height: 1.8; color: #444; font-size: 1.05rem;">
                                ${aiResponse}
                            </div>
                        </div>
                    `;
                } else {
                    decCalcResult.innerHTML = '<p class="error">Gagal mendapatkan analisis AI.</p>';
                }
            })
            .catch(err => {
                console.error(err);
                decCalcResult.innerHTML = '<p class="error">Terjadi kesalahan koneksi.</p>';
            });
        });
    }


    // ===== ULTIMATE INCOME STATEMENT GENERATOR =====

// ===== ULTIMATE INCOME STATEMENT GENERATOR (REVISI VARIABEL UNIK) =====

    // --- 1. GLOBAL VARIABLES & HELPERS (DENGAN NAMA UNIK) ---
    // Menggunakan nama 'incomeStmtForm' agar tidak bentrok dengan 'const form' lain
    const incomeStmtForm = document.getElementById('income-stmt-form'); 
    
    const incPreviewBtn = document.getElementById('btn-preview-report');
    const incTableBody = document.getElementById('report-table-body');
    const incDateDisplay = document.getElementById('report-date-display');
    const incLoadingOverlay = document.getElementById('loading-overlay');
    const incAiSection = document.getElementById('ai-analysis-print-section');
    const incAiContent = document.getElementById('ai-content-print');

    // Set Date Default
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    if(incDateDisplay) incDateDisplay.textContent = today;

    // Helper: Format Rupiah Clean
    function formatRupiah(num) {
        if (num < 0) return `(Rp ${Math.abs(num).toLocaleString('id-ID')})`;
        return `Rp ${num.toLocaleString('id-ID')}`;
    }

    // Helper: Parse Input Value
    function getVal(input) {
        if (!input) return 0;
        return parseFloat(input.value.replace(/\./g, '')) || 0;
    }

    // Helper: Global Formatter Attacher (Run on new inputs)
    window.attachFormatters = function() {
        document.querySelectorAll('.input-nominal').forEach(input => {
            input.removeEventListener('input', formatInput); // Prevent duplicate
            input.addEventListener('input', formatInput);
        });
    };

    function formatInput() {
        let val = this.value.replace(/\./g, '');
        this.value = val.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Initial attach
    attachFormatters();

    // --- 2. DYNAMIC ROW FUNCTION ---
    window.addDynamicRow = function(containerId) {
        const container = document.getElementById(containerId);
        const div = document.createElement('div');
        div.className = 'dynamic-row fade-in-up';
        
        // Determine class based on container for calculation logic
        let inputClass = 'input-nominal';
        if (containerId === 'revenue-container') inputClass += ' income-source';
        if (containerId === 'cogs-container') inputClass += ' cogs-item';
        if (containerId === 'opex-container') inputClass += ' opex-item';

        div.innerHTML = `
            <input type="text" class="input-label" placeholder="Nama Akun Baru" required>
            <input type="text" class="${inputClass}" placeholder="Rp 0" required>
            <button type="button" class="btn-del-row" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>
        `;
        container.appendChild(div);
        attachFormatters(); // Re-attach formatters to new input
    };

    // --- 3. REFRESH PREVIEW LOGIC (CORE CALCULATION) ---
    window.refreshReportPreview = function() {
        // --- LOGIKA BARU: UPDATE HEADER (NAMA & TANGGAL) ---
        const compNameInput = document.getElementById('inp_company_name');
        const reportDateInput = document.getElementById('inp_report_date');
        const compPlaceholder = document.getElementById('company-name-placeholder');
        const dateDisplay = document.getElementById('report-date-display');

        // 1. Update Nama Perusahaan
        if (compNameInput && compPlaceholder) {
            // Jika kosong, pakai default
            compPlaceholder.textContent = compNameInput.value.trim() || "NAMA PERUSAHAAN ANDA"; 
        }

        // 2. Update Tanggal Laporan
        if (reportDateInput && dateDisplay) {
            if (reportDateInput.value) {
                // Format tanggal input (YYYY-MM-DD) ke format Indonesia (19 Januari 2026)
                const dateObj = new Date(reportDateInput.value);
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                dateDisplay.textContent = dateObj.toLocaleDateString('id-ID', options);
            } else {
                // Jika kosong, pakai hari ini
                const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                dateDisplay.textContent = today;
            }
        }
        // ----------------------------------------------------

       
        let html = '';

        // A. REVENUE
        let totalRevenue = 0;
        let revenueRows = '';
        
        // Income Sources
        document.querySelectorAll('.income-source').forEach(el => {
            const val = getVal(el);
            const label = el.previousElementSibling.value || 'Pendapatan';
            if(val > 0) {
                totalRevenue += val;
                revenueRows += `<tr><td class="row-item-name">${label}</td><td class="row-amount">${formatRupiah(val)}</td></tr>`;
            }
        });

        // Deductions (Retur)
        let totalDeductions = 0;
        document.querySelectorAll('.income-deduction').forEach(el => {
            const val = getVal(el);
            const label = el.previousElementSibling.value;
            if(val > 0) {
                totalDeductions += val;
                revenueRows += `<tr><td class="row-item-name">${label}</td><td class="row-amount" style="color:red;">(${formatRupiah(val)})</td></tr>`;
            }
        });

        const netSales = totalRevenue - totalDeductions;

        html += `
            <tr><td colspan="2" class="row-header">PENDAPATAN (REVENUE)</td></tr>
            ${revenueRows}
            <tr><td class="row-subtotal">PENJUALAN BERSIH</td><td class="row-subtotal row-amount">${formatRupiah(netSales)}</td></tr>
        `;

        // B. COGS
        let totalCOGS = 0;
        let cogsRows = '';
        document.querySelectorAll('.cogs-item').forEach(el => {
            const val = getVal(el);
            const label = el.previousElementSibling.value || 'Biaya';
            if(val > 0) {
                totalCOGS += val;
                cogsRows += `<tr><td class="row-item-name">${label}</td><td class="row-amount">(${formatRupiah(val)})</td></tr>`;
            }
        });

        const grossProfit = netSales - totalCOGS;

        html += `
            <tr><td colspan="2" class="row-header">HARGA POKOK PENJUALAN (COGS)</td></tr>
            ${cogsRows}
            <tr style="background:#f0f4f8;"><td class="row-subtotal">LABA KOTOR (GROSS PROFIT)</td><td class="row-subtotal row-amount">${formatRupiah(grossProfit)}</td></tr>
        `;

        // C. OPEX
        let totalOpex = 0;
        let opexRows = '';
        document.querySelectorAll('.opex-item').forEach(el => {
            const val = getVal(el);
            const label = el.previousElementSibling.value || 'Beban';
            if(val > 0) {
                totalOpex += val;
                opexRows += `<tr><td class="row-item-name">${label}</td><td class="row-amount">(${formatRupiah(val)})</td></tr>`;
            }
        });

        const operatingIncome = grossProfit - totalOpex;

        html += `
            <tr><td colspan="2" class="row-header">BEBAN OPERASIONAL</td></tr>
            ${opexRows}
            <tr><td class="row-subtotal">TOTAL BEBAN OPERASIONAL</td><td class="row-subtotal row-amount">(${formatRupiah(totalOpex)})</td></tr>
            <tr style="background:#e8f6f3;"><td class="row-subtotal">LABA OPERASIONAL (EBIT)</td><td class="row-subtotal row-amount">${formatRupiah(operatingIncome)}</td></tr>
        `;

        // D. OTHER & TAX
        const interest = getVal(document.getElementById('inp_interest'));
        const otherInc = getVal(document.getElementById('inp_other_income'));
        
        const ebt = operatingIncome + otherInc - interest;
        
        const taxRate = parseFloat(document.getElementById('inp_tax_rate').value) || 0;
        const taxExp = ebt > 0 ? ebt * (taxRate / 100) : 0;
        
        const netIncome = ebt - taxExp;

        html += `
            <tr><td colspan="2" class="row-header">PENDAPATAN & BEBAN LAIN</td></tr>
            <tr><td class="row-item-name">Beban Bunga</td><td class="row-amount">(${formatRupiah(interest)})</td></tr>
            ${otherInc > 0 ? `<tr><td class="row-item-name">Pendapatan Lain</td><td class="row-amount">${formatRupiah(otherInc)}</td></tr>` : ''}
            <tr><td class="row-subtotal">LABA SEBELUM PAJAK (EBT)</td><td class="row-subtotal row-amount">${formatRupiah(ebt)}</td></tr>
            <tr><td class="row-item-name">Pajak Penghasilan (${taxRate}%)</td><td class="row-amount">(${formatRupiah(taxExp)})</td></tr>
            <tr class="row-grand-total"><td>LABA BERSIH (NET INCOME)</td><td class="row-amount">${formatRupiah(netIncome)}</td></tr>
        `;
        const incTableBody = document.getElementById('report-table-body');

        if (incTableBody) incTableBody.innerHTML = html;
        return { netSales, grossProfit, operatingIncome, netIncome, totalCOGS, totalOpex }; // Return data for AI
    };

    // Manual Refresh Button
    if(incPreviewBtn) {
        incPreviewBtn.addEventListener('click', refreshReportPreview);
    }

    // --- 4. SUBMIT: AI GENERATION & PDF EXPORT ---
    // MENGGUNAKAN VARIABEL incomeStmtForm (BUKAN form)
   // --- 4. SUBMIT: AI GENERATION & SMART PDF EXPORT ---
    if(incomeStmtForm) {
        incomeStmtForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // 1. Refresh Data & Get Numbers
            const data = refreshReportPreview();
            
            // 2. Show Loading
            if(incLoadingOverlay) incLoadingOverlay.style.display = 'block';
            
            // 3. AI Analysis Prompt (Tetap sama)
            const prompt = `
                Sebagai CFO Virtual, berikan analisis singkat dan tajam (maksimal 150 kata) untuk Laporan Laba Rugi ini.
                Gunakan format paragraf profesional.
                
                Data:
                - Penjualan Bersih: Rp ${data.netSales.toLocaleString('id-ID')}
                - Laba Kotor: Rp ${data.grossProfit.toLocaleString('id-ID')}
                - Laba Operasional: Rp ${data.operatingIncome.toLocaleString('id-ID')}
                - Laba Bersih: Rp ${data.netIncome.toLocaleString('id-ID')}
                
                Fokus pada: Margin Profitabilitas, efisiensi COGS dan OPEX.
            `;

            try {
                // Fetch AI (Tetap sama)
              fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
                const apiData = await response.json();
                
                if(apiData.candidates && incAiContent) {
                    const aiText = apiData.candidates[0].content.parts[0].text;
                    incAiContent.innerHTML = marked.parse(aiText);
                    if(incAiSection) incAiSection.style.display = 'block';
                }
            } catch (err) {
                console.error("AI Error", err);
                if(incAiContent) incAiContent.innerHTML = "Analisis AI tidak tersedia (Offline Mode).";
                if(incAiSection) incAiSection.style.display = 'block';
            } finally {
                if(incLoadingOverlay) incLoadingOverlay.style.display = 'none';
            }

            // 4. SMART PDF GENERATION (MULTI-PAGE SUPPORT)
            setTimeout(async () => {
                const element = document.getElementById('printable-area');
                
                // Gunakan scale 2 untuk ketajaman, tapi kita akan resize nanti di PDF
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    logging: false
                });

                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                
                // Ukuran A4 dalam mm
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210; // Lebar A4 full
                const pageHeight = 297; // Tinggi A4 full
                
                // Hitung tinggi gambar yang dihasilkan berdasarkan rasio lebar A4
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                let heightLeft = imgHeight;
                let position = 0;

                // Halaman Pertama
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                // Jika konten lebih panjang dari 1 halaman, tambah halaman baru
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight; // Geser posisi gambar ke atas (negatif)
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                
                // Save
                pdf.save(`Laporan_Laba_Rugi_${new Date().toISOString().slice(0,10)}.pdf`);
            }, 800); // Sedikit delay lebih lama untuk memastikan render AI selesai
        });
    }

// ===== BALANCE SHEET BUILDER SCRIPT =====

    // Unique Variables
    const bsForm = document.getElementById('balance-sheet-form');
    const bsPreviewBtn = document.getElementById('btn-preview-bs');
    const bsTableBody = document.getElementById('bs-table-body');
    const bsStatusBar = document.getElementById('balance-status-bar');
    
    // Header Elements
    const bsCompName = document.getElementById('bs_company_name');
    const bsReportDate = document.getElementById('bs_report_date');
    const bsCompDisplay = document.getElementById('bs-company-name-display');
    const bsDateDisplay = document.getElementById('bs-date-display');

    const bsLoading = document.getElementById('bs-loading-overlay');
    const bsAiSection = document.getElementById('bs-ai-section');
    const bsAiContent = document.getElementById('bs-ai-content');

    // --- 1. DYNAMIC ROW ---
    window.addBsRow = function(containerId, itemClass) {
        const container = document.getElementById(containerId);
        const div = document.createElement('div');
        div.className = 'dynamic-row fade-in-up';
        
        div.innerHTML = `
            <input type="text" class="input-label" placeholder="Nama Akun Baru" required>
            <input type="text" class="input-nominal ${itemClass}" placeholder="Rp 0" required>
            <button type="button" class="btn-del-row" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>
        `;
        container.appendChild(div);
        
        // Re-attach formatter (reuse fungsi dari fitur sebelumnya jika ada)
        if(window.attachFormatters) window.attachFormatters(); 
    };

    // Helper Parse
    function getBsVal(el) {
        if (!el) return 0;
        return parseFloat(el.value.replace(/\./g, '')) || 0;
    }

    function formatBsRupiah(num) {
        return 'Rp ' + num.toLocaleString('id-ID');
    }

    // --- 2. REFRESH & CALCULATE ---
    window.refreshBsPreview = function() {
        // Update Header
        if(bsCompName && bsCompDisplay) bsCompDisplay.textContent = bsCompName.value.trim() || "NAMA PERUSAHAAN";
        if(bsReportDate && bsDateDisplay) {
            const dateVal = bsReportDate.value ? new Date(bsReportDate.value) : new Date();
            bsDateDisplay.textContent = dateVal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        let html = '';
        
        // --- A. ASSETS ---
        let totalCurrAsset = 0;
        let totalNonAsset = 0;
        let rowsCurr = '';
        let rowsNon = '';

        document.querySelectorAll('.asset-curr').forEach(el => {
            const val = getBsVal(el);
            const label = el.previousElementSibling.value || 'Aset';
            if(val > 0) { totalCurrAsset += val; rowsCurr += `<tr><td class="row-item-name">${label}</td><td class="row-amount">${formatBsRupiah(val)}</td></tr>`; }
        });

        document.querySelectorAll('.asset-non').forEach(el => {
            const val = getBsVal(el);
            const label = el.previousElementSibling.value || 'Aset';
            if(val > 0) { totalNonAsset += val; rowsNon += `<tr><td class="row-item-name">${label}</td><td class="row-amount">${formatBsRupiah(val)}</td></tr>`; }
        });

        const totalAssets = totalCurrAsset + totalNonAsset;

        html += `
            <tr><td colspan="2" class="row-header">ASET (ASSETS)</td></tr>
            <tr><td colspan="2" style="font-weight:bold; padding-left:10px;">Aset Lancar</td></tr>
            ${rowsCurr}
            <tr><td class="row-subtotal">Total Aset Lancar</td><td class="row-subtotal row-amount">${formatBsRupiah(totalCurrAsset)}</td></tr>
            
            <tr><td colspan="2" style="font-weight:bold; padding-left:10px; padding-top:10px;">Aset Tidak Lancar</td></tr>
            ${rowsNon}
            <tr><td class="row-subtotal">Total Aset Tidak Lancar</td><td class="row-subtotal row-amount">${formatBsRupiah(totalNonAsset)}</td></tr>
            
            <tr class="row-grand-total" style="background:#e6fffa;"><td>TOTAL ASET</td><td class="row-amount">${formatBsRupiah(totalAssets)}</td></tr>
            <tr><td colspan="2" style="height: 20px;"></td></tr>
        `;

        // --- B. LIABILITIES ---
        let totalLiabCurr = 0;
        let totalLiabLong = 0;
        let rowsLiabCurr = '';
        let rowsLiabLong = '';

        document.querySelectorAll('.liab-curr').forEach(el => {
            const val = getBsVal(el);
            const label = el.previousElementSibling.value;
            if(val > 0) { totalLiabCurr += val; rowsLiabCurr += `<tr><td class="row-item-name">${label}</td><td class="row-amount">${formatBsRupiah(val)}</td></tr>`; }
        });

        document.querySelectorAll('.liab-long').forEach(el => {
            const val = getBsVal(el);
            const label = el.previousElementSibling.value;
            if(val > 0) { totalLiabLong += val; rowsLiabLong += `<tr><td class="row-item-name">${label}</td><td class="row-amount">${formatBsRupiah(val)}</td></tr>`; }
        });

        const totalLiabilities = totalLiabCurr + totalLiabLong;

        html += `
            <tr><td colspan="2" class="row-header">LIABILITAS (LIABILITIES)</td></tr>
            <tr><td colspan="2" style="font-weight:bold; padding-left:10px;">Jangka Pendek</td></tr>
            ${rowsLiabCurr}
            <tr><td class="row-subtotal">Total Liabilitas Jangka Pendek</td><td class="row-subtotal row-amount">${formatBsRupiah(totalLiabCurr)}</td></tr>
            
            <tr><td colspan="2" style="font-weight:bold; padding-left:10px; padding-top:10px;">Jangka Panjang</td></tr>
            ${rowsLiabLong}
            <tr><td class="row-subtotal">Total Liabilitas Jangka Panjang</td><td class="row-subtotal row-amount">${formatBsRupiah(totalLiabLong)}</td></tr>
            
            <tr class="row-subtotal" style="background:#fff7ed;"><td>TOTAL LIABILITAS</td><td class="row-amount">${formatBsRupiah(totalLiabilities)}</td></tr>
        `;

        // --- C. EQUITY ---
        let totalEquity = 0;
        let rowsEquity = '';

        document.querySelectorAll('.equity-item').forEach(el => {
            const val = getBsVal(el);
            const label = el.previousElementSibling.value;
            if(val > 0) { totalEquity += val; rowsEquity += `<tr><td class="row-item-name">${label}</td><td class="row-amount">${formatBsRupiah(val)}</td></tr>`; }
        });

        const totalLiabEquity = totalLiabilities + totalEquity;

        html += `
            <tr><td colspan="2" class="row-header" style="padding-top:20px;">EKUITAS (EQUITY)</td></tr>
            ${rowsEquity}
            <tr><td class="row-subtotal">Total Ekuitas</td><td class="row-subtotal row-amount">${formatBsRupiah(totalEquity)}</td></tr>
            
            <tr class="row-grand-total" style="background:#e6fffa;"><td>TOTAL LIABILITAS & EKUITAS</td><td class="row-amount">${formatBsRupiah(totalLiabEquity)}</td></tr>
        `;

        if(bsTableBody) bsTableBody.innerHTML = html;

        // --- D. CHECK BALANCE ---
        const diff = totalAssets - totalLiabEquity;
        if(bsStatusBar) {
            if (diff === 0 && totalAssets > 0) {
                bsStatusBar.className = 'balance-status status-balanced';
                bsStatusBar.innerHTML = '<i class="fas fa-check-circle"></i> SEIMBANG (BALANCED)';
            } else if (totalAssets === 0) {
                bsStatusBar.className = 'balance-status status-pending';
                bsStatusBar.innerHTML = '<i class="fas fa-info-circle"></i> Menunggu Data';
            } else {
                bsStatusBar.className = 'balance-status status-unbalanced';
                bsStatusBar.innerHTML = `<i class="fas fa-exclamation-triangle"></i> TIDAK SEIMBANG (Selisih: ${formatBsRupiah(diff)})`;
            }
        }

        return { totalAssets, totalLiabilities, totalEquity, diff };
    };

    if(bsPreviewBtn) {
        bsPreviewBtn.addEventListener('click', refreshBsPreview);
    }

    // --- 3. SUBMIT & PDF ---
    if(bsForm) {
        bsForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = refreshBsPreview();

            if(bsLoading) bsLoading.style.display = 'block';

            // Prompt AI
            const prompt = `
                Sebagai Auditor Senior, analisis Neraca Keuangan ini:
                - Total Aset: Rp ${data.totalAssets.toLocaleString('id-ID')}
                - Total Liabilitas: Rp ${data.totalLiabilities.toLocaleString('id-ID')}
                - Total Ekuitas: Rp ${data.totalEquity.toLocaleString('id-ID')}
                - Status Balance: ${data.diff === 0 ? "Seimbang" : "Tidak Seimbang (Selisih " + data.diff + ")"}
                
                Berikan 3 poin analisis mengenai struktur modal (Debt to Equity) dan likuiditas aset.
            `;

            try {
               fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
                const apiData = await response.json();
                
                if(apiData.candidates && bsAiContent) {
                    const aiText = apiData.candidates[0].content.parts[0].text;
                    bsAiContent.innerHTML = marked.parse(aiText);
                    if(bsAiSection) bsAiSection.style.display = 'block';
                }
            } catch (err) {
                console.error("AI Error", err);
                if(bsAiContent) bsAiContent.innerHTML = "Analisis AI tidak tersedia.";
                if(bsAiSection) bsAiSection.style.display = 'block';
            } finally {
                if(bsLoading) bsLoading.style.display = 'none';
            }

            // PDF Generation (Auto Multi-Page Logic)
            setTimeout(async () => {
                const element = document.getElementById('bs-printable-area');
                const canvas = await html2canvas(element, { scale: 2, useCORS: true });
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210;
                const pageHeight = 297;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                
                pdf.save(`Neraca_${new Date().toISOString().slice(0,10)}.pdf`);
            }, 800);
        });
    }
// ===== CASH FLOW STATEMENT GENERATOR SCRIPT =====

    // Unique Variables
    const cfForm = document.getElementById('cash-flow-form');
    const cfPreviewBtn = document.getElementById('btn-preview-cf');
    const cfTableBody = document.getElementById('cf-table-body');
    
    // Header Elements
    const cfCompName = document.getElementById('cf_company_name');
    const cfReportDate = document.getElementById('cf_report_date');
    const cfCompDisplay = document.getElementById('cf-company-name-display');
    const cfDateDisplay = document.getElementById('cf-date-display');
    const cfBegCashInput = document.getElementById('cf_beg_cash');

    const cfLoading = document.getElementById('cf-loading-overlay');
    const cfAiSection = document.getElementById('cf-ai-section');
    const cfAiContent = document.getElementById('cf-ai-content');

    // --- 1. DYNAMIC ROW ---
    window.addCfRow = function(containerId, itemClass) {
        const container = document.getElementById(containerId);
        const div = document.createElement('div');
        div.className = 'dynamic-row fade-in-up';
        
        div.innerHTML = `
            <input type="text" class="input-label" placeholder="Nama Akun Baru" required>
            <input type="text" class="input-nominal ${itemClass}" placeholder="Rp 0" required>
            <button type="button" class="btn-del-row" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>
        `;
        container.appendChild(div);
        
        if(window.attachFormatters) window.attachFormatters(); 
    };

    // Helper Parse
    function getCfVal(el) {
        if (!el) return 0;
        return parseFloat(el.value.replace(/\./g, '')) || 0;
    }

    function formatCfRupiah(num) {
        if (num < 0) return `(Rp ${Math.abs(num).toLocaleString('id-ID')})`;
        return `Rp ${num.toLocaleString('id-ID')}`;
    }

    // --- 2. REFRESH & CALCULATE ---
    window.refreshCfPreview = function() {
        // Update Header
        if(cfCompName && cfCompDisplay) cfCompDisplay.textContent = cfCompName.value.trim() || "NAMA PERUSAHAAN";
        if(cfReportDate && cfDateDisplay) {
            const dateVal = cfReportDate.value ? new Date(cfReportDate.value) : new Date();
            cfDateDisplay.textContent = dateVal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        let html = '';
        
        // --- A. OPERATING (CFO) ---
        let totalCFO = 0;
        let rowsCFO = '';
        document.querySelectorAll('.cfo-item').forEach(el => {
            const val = getCfVal(el);
            const label = el.previousElementSibling.value || 'Item Operasi';
            // Logic: Just sum the input (User responsible for +/- signs)
            if(val !== 0) { 
                totalCFO += val; 
                rowsCFO += `<tr><td class="row-item-name">${label}</td><td class="row-amount">${formatCfRupiah(val)}</td></tr>`; 
            }
        });

        html += `
            <tr><td colspan="2" class="row-header-cf">ARUS KAS DARI AKTIVITAS OPERASI</td></tr>
            ${rowsCFO}
            <tr><td class="row-subtotal">Kas Bersih dari Aktivitas Operasi</td><td class="row-total-cf row-amount">${formatCfRupiah(totalCFO)}</td></tr>
        `;

        // --- B. INVESTING (CFI) ---
        let totalCFI = 0;
        let rowsCFI = '';
        document.querySelectorAll('.cfi-item').forEach(el => {
            const val = getCfVal(el);
            const label = el.previousElementSibling.value || 'Item Investasi';
            if(val !== 0) { 
                totalCFI += val; 
                rowsCFI += `<tr><td class="row-item-name">${label}</td><td class="row-amount">${formatCfRupiah(val)}</td></tr>`; 
            }
        });

        html += `
            <tr><td colspan="2" class="row-header-cf" style="padding-top:20px;">ARUS KAS DARI AKTIVITAS INVESTASI</td></tr>
            ${rowsCFI}
            <tr><td class="row-subtotal">Kas Bersih dari Aktivitas Investasi</td><td class="row-total-cf row-amount">${formatCfRupiah(totalCFI)}</td></tr>
        `;

        // --- C. FINANCING (CFF) ---
        let totalCFF = 0;
        let rowsCFF = '';
        document.querySelectorAll('.cff-item').forEach(el => {
            const val = getCfVal(el);
            const label = el.previousElementSibling.value || 'Item Pendanaan';
            if(val !== 0) { 
                totalCFF += val; 
                rowsCFF += `<tr><td class="row-item-name">${label}</td><td class="row-amount">${formatCfRupiah(val)}</td></tr>`; 
            }
        });

        html += `
            <tr><td colspan="2" class="row-header-cf" style="padding-top:20px;">ARUS KAS DARI AKTIVITAS PENDANAAN</td></tr>
            ${rowsCFF}
            <tr><td class="row-subtotal">Kas Bersih dari Aktivitas Pendanaan</td><td class="row-total-cf row-amount">${formatCfRupiah(totalCFF)}</td></tr>
        `;

        // --- D. SUMMARY ---
        const netIncrease = totalCFO + totalCFI + totalCFF;
        const begCash = getCfVal(cfBegCashInput);
        const endCash = begCash + netIncrease;

        html += `
            <tr><td colspan="2" style="height:20px; border-bottom:1px solid #ccc;"></td></tr>
            <tr><td style="padding-top:15px;">Kenaikan (Penurunan) Bersih Kas</td><td class="row-amount" style="padding-top:15px; font-weight:bold;">${formatCfRupiah(netIncrease)}</td></tr>
            <tr><td>Saldo Kas Awal Periode</td><td class="row-amount">${formatCfRupiah(begCash)}</td></tr>
            <tr class="row-grand-total-cf"><td>SALDO KAS AKHIR PERIODE</td><td class="row-amount">${formatCfRupiah(endCash)}</td></tr>
        `;

        if(cfTableBody) cfTableBody.innerHTML = html;

        return { totalCFO, totalCFI, totalCFF, netIncrease, endCash };
    };

    if(cfPreviewBtn) {
        cfPreviewBtn.addEventListener('click', refreshCfPreview);
    }

    // --- 3. SUBMIT & PDF ---
    if(cfForm) {
        cfForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = refreshCfPreview();

            if(cfLoading) cfLoading.style.display = 'block';

            // Prompt AI
            const prompt = `
                Sebagai CFO, analisis Laporan Arus Kas ini:
                - Kas Operasi (CFO): Rp ${data.totalCFO.toLocaleString('id-ID')}
                - Kas Investasi (CFI): Rp ${data.totalCFI.toLocaleString('id-ID')}
                - Kas Pendanaan (CFF): Rp ${data.totalCFF.toLocaleString('id-ID')}
                - Kenaikan Bersih: Rp ${data.netIncrease.toLocaleString('id-ID')}
                
                Berikan analisis singkat tentang kualitas laba (CFO vs Net Income jika ada), keberlanjutan investasi, dan kesehatan likuiditas.
            `;

            try {
            fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
                const apiData = await response.json();
                
                if(apiData.candidates && cfAiContent) {
                    const aiText = apiData.candidates[0].content.parts[0].text;
                    cfAiContent.innerHTML = marked.parse(aiText);
                    if(cfAiSection) cfAiSection.style.display = 'block';
                }
            } catch (err) {
                console.error("AI Error", err);
                if(cfAiContent) cfAiContent.innerHTML = "Analisis AI tidak tersedia.";
                if(cfAiSection) cfAiSection.style.display = 'block';
            } finally {
                if(cfLoading) cfLoading.style.display = 'none';
            }

            // PDF Generation (Auto Multi-Page Logic)
            setTimeout(async () => {
                const element = document.getElementById('cf-printable-area');
                const canvas = await html2canvas(element, { scale: 2, useCORS: true });
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210;
                const pageHeight = 297;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                
                pdf.save(`Arus_Kas_${new Date().toISOString().slice(0,10)}.pdf`);
            }, 800);
        });
    }
// ===== DETAILED COGS REPORT GENERATOR SCRIPT =====

    // DOM Elements
    const cogsForm = document.getElementById('cogs-form');
    const cogsPreviewBtn = document.getElementById('btn-preview-cogs');
    const cogsTableBody = document.getElementById('cogs-table-body');
    
    // Header & Identitas
    const cogsCompName = document.getElementById('cogs_company_name');
    const cogsReportDate = document.getElementById('cogs_report_date');
    const cogsCompDisplay = document.getElementById('cogs-company-name-display');
    const cogsDateDisplay = document.getElementById('cogs-date-display');

    // Inputs Utama
    const inpRmBeg = document.getElementById('cogs_rm_beg');
    const inpRmPurchases = document.getElementById('cogs_rm_purchases');
    const inpRmEnd = document.getElementById('cogs_rm_end');
    const inpWipBeg = document.getElementById('cogs_wip_beg');
    const inpWipEnd = document.getElementById('cogs_wip_end');
    const inpFgBeg = document.getElementById('cogs_fg_beg');
    const inpFgEnd = document.getElementById('cogs_fg_end');

    // AI & Loading
    const cogsLoading = document.getElementById('cogs-loading-overlay');
    const cogsAiSection = document.getElementById('cogs-ai-section');
    const cogsAiContent = document.getElementById('cogs-ai-content');

    // --- 1. HELPERS & DYNAMIC ROWS ---
    window.addCogsRow = function(containerId, itemClass) {
        const container = document.getElementById(containerId);
        const div = document.createElement('div');
        div.className = 'dynamic-row fade-in-up';
        
        let placeholder = "Nama Akun Biaya";
        if(itemClass === 'dl-item') placeholder = "Rincian Biaya TKL";
        if(itemClass === 'foh-item') placeholder = "Rincian Biaya Overhead";
        if(itemClass === 'adj-item') placeholder = "Penyesuaian (+/-)";

        div.innerHTML = `
            <input type="text" class="input-label" placeholder="${placeholder}" required>
            <input type="text" class="input-nominal ${itemClass}" placeholder="Rp 0" required>
            <button type="button" class="btn-del-row" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>
        `;
        container.appendChild(div);
        if(window.attachFormatters) window.attachFormatters(); 
    };

    function getCogsVal(el) {
        if (!el) return 0;
        // Handle nilai negatif jika user mengetik tanda minus
        let valStr = el.value.replace(/\./g, '');
        let multiplier = 1;
        if(valStr.includes('-')) {
            multiplier = -1;
            valStr = valStr.replace('-', '');
        }
        return (parseFloat(valStr) || 0) * multiplier;
    }

    function formatCogsRupiah(num, isNegative = false) {
        // Jika isNegative true, paksa tampil dalam kurung meskipun angkanya positif (untuk item pengurang)
        if (num < 0 || isNegative) {
             return `(Rp ${Math.abs(num).toLocaleString('id-ID')})`;
        }
        return `Rp ${num.toLocaleString('id-ID')}`;
    }

    // --- 2. CORE CALCULATION & HTML GENERATION ---
    window.refreshCogsPreview = function() {
        // Update Header
        if(cogsCompName && cogsCompDisplay) cogsCompDisplay.textContent = cogsCompName.value.trim() || "NAMA PERUSAHAAN";
        if(cogsReportDate && cogsDateDisplay) {
            const dateVal = cogsReportDate.value ? new Date(cogsReportDate.value) : new Date();
            cogsDateDisplay.textContent = dateVal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        let html = '';

        // --- STEP 1: BAHAN BAKU LANGSUNG DI GUNAKAN (Raw Materials Used) ---
        const rmBeg = getCogsVal(inpRmBeg);
        const rmPurchases = getCogsVal(inpRmPurchases);
        const rmAvailable = rmBeg + rmPurchases;
        const rmEnd = getCogsVal(inpRmEnd);
        const rmUsed = rmAvailable - rmEnd;

        html += `
            <tr><td colspan="3" class="cogs-header">1. BAHAN BAKU LANGSUNG (DIRECT MATERIALS)</td></tr>
            <tr><td class="cogs-indent-1">Persediaan Awal Bahan Baku</td><td></td><td class="col-total">${formatCogsRupiah(rmBeg)}</td></tr>
            <tr><td class="cogs-indent-1">(+) Pembelian Bahan Baku Bersih</td><td></td><td class="col-detail">${formatCogsRupiah(rmPurchases)}</td></tr>
            <tr class="cogs-subtotal-line"><td class="cogs-indent-1">Bahan Baku Tersedia untuk Dipakai</td><td></td><td class="col-total">${formatCogsRupiah(rmAvailable)}</td></tr>
            <tr><td class="cogs-indent-1">(-) Persediaan Akhir Bahan Baku</td><td></td><td class="col-detail" style="color:#be123c;">${formatCogsRupiah(rmEnd, true)}</td></tr>
            <tr class="cogs-section-total"><td class="cogs-indent-1">TOTAL BAHAN BAKU DIGUNAKAN</td><td></td><td class="col-total">${formatCogsRupiah(rmUsed)}</td></tr>
        `;

        // --- STEP 2: TENAGA KERJA LANGSUNG (Direct Labor) ---
        let totalDL = 0;
        let rowsDL = '';
        document.querySelectorAll('.dl-item').forEach(el => {
            const val = getCogsVal(el);
            const label = el.previousElementSibling.value || 'Biaya TKL';
            if(val !== 0) { 
                totalDL += val; 
                rowsDL += `<tr><td class="cogs-indent-2">${label}</td><td class="col-detail">${formatCogsRupiah(val)}</td><td></td></tr>`; 
            }
        });

        html += `
            <tr><td colspan="3" class="cogs-header" style="padding-top:25px;">2. TENAGA KERJA LANGSUNG (DIRECT LABOR)</td></tr>
            ${rowsDL}
            <tr class="cogs-section-total"><td class="cogs-indent-1">TOTAL TENAGA KERJA LANGSUNG</td><td></td><td class="col-total">${formatCogsRupiah(totalDL)}</td></tr>
        `;

        // --- STEP 3: OVERHEAD PABRIK (Factory Overhead) ---
        let totalFOH = 0;
        let rowsFOH = '';
        document.querySelectorAll('.foh-item').forEach(el => {
            const val = getCogsVal(el);
            const label = el.previousElementSibling.value || 'Biaya Overhead';
            if(val !== 0) { 
                totalFOH += val; 
                rowsFOH += `<tr><td class="cogs-indent-2">${label}</td><td class="col-detail">${formatCogsRupiah(val)}</td><td></td></tr>`; 
            }
        });

        html += `
            <tr><td colspan="3" class="cogs-header" style="padding-top:25px;">3. OVERHEAD PABRIK (FACTORY OVERHEAD)</td></tr>
            ${rowsFOH}
            <tr class="cogs-section-total"><td class="cogs-indent-1">TOTAL OVERHEAD PABRIK</td><td></td><td class="col-total">${formatCogsRupiah(totalFOH)}</td></tr>
        `;

        // --- TOTAL BIAYA PRODUKSI (Total Manufacturing Costs) ---
        const totalMfgCosts = rmUsed + totalDL + totalFOH;
        html += `
             <tr><td colspan="3" style="height:15px;"></td></tr>
            <tr class="cogs-section-total" style="background:#ffe4e6; font-size:1.05rem;"><td colspan="2">TOTAL BIAYA PRODUKSI PERIODE INI (1+2+3)</td><td class="col-total">${formatCogsRupiah(totalMfgCosts)}</td></tr>
        `;

        // --- STEP 4: HARGA POKOK PRODUKSI (COGM - Cost of Goods Manufactured) ---
        const wipBeg = getCogsVal(inpWipBeg);
        const totalWipAvailable = totalMfgCosts + wipBeg;
        const wipEnd = getCogsVal(inpWipEnd);
        const cogm = totalWipAvailable - wipEnd;

        html += `
            <tr><td colspan="3" class="cogs-header" style="padding-top:25px;">4. PERHITUNGAN HARGA POKOK PRODUKSI (COGM)</td></tr>
            <tr><td class="cogs-indent-1">(+) Persediaan Awal Barang Dalam Proses (WIP)</td><td></td><td class="col-detail">${formatCogsRupiah(wipBeg)}</td></tr>
            <tr class="cogs-subtotal-line"><td class="cogs-indent-1">Total WIP Siap Diproses</td><td></td><td class="col-total">${formatCogsRupiah(totalWipAvailable)}</td></tr>
            <tr><td class="cogs-indent-1">(-) Persediaan Akhir Barang Dalam Proses (WIP)</td><td></td><td class="col-detail" style="color:#be123c;">${formatCogsRupiah(wipEnd, true)}</td></tr>
            <tr class="cogs-section-total"><td class="cogs-indent-1">HARGA POKOK PRODUKSI (COGM)</td><td></td><td class="col-total">${formatCogsRupiah(cogm)}</td></tr>
        `;

        // --- STEP 5: HARGA POKOK PENJUALAN (COGS - Cost of Goods Sold) ---
        const fgBeg = getCogsVal(inpFgBeg);
        const goodsAvailableForSale = cogm + fgBeg;
        const fgEnd = getCogsVal(inpFgEnd);
        let cogsBeforeAdj = goodsAvailableForSale - fgEnd;

        html += `
            <tr><td colspan="3" class="cogs-header" style="padding-top:25px;">5. PERHITUNGAN HARGA POKOK PENJUALAN (COGS)</td></tr>
            <tr><td class="cogs-indent-1">(+) Persediaan Awal Barang Jadi</td><td></td><td class="col-detail">${formatCogsRupiah(fgBeg)}</td></tr>
            <tr class="cogs-subtotal-line"><td class="cogs-indent-1">Barang Tersedia untuk Dijual</td><td></td><td class="col-total">${formatCogsRupiah(goodsAvailableForSale)}</td></tr>
            <tr><td class="cogs-indent-1">(-) Persediaan Akhir Barang Jadi</td><td></td><td class="col-detail" style="color:#be123c;">${formatCogsRupiah(fgEnd, true)}</td></tr>
            <tr class="cogs-subtotal-line"><td class="cogs-indent-1">HPP Sebelum Penyesuaian</td><td></td><td class="col-total">${formatCogsRupiah(cogsBeforeAdj)}</td></tr>
        `;

         // --- STEP 6: PENYESUAIAN LAINNYA (Adjustments) ---
        let totalAdj = 0;
        let rowsAdj = '';
        document.querySelectorAll('.adj-item').forEach(el => {
            const val = getCogsVal(el);
            const label = el.previousElementSibling.value || 'Penyesuaian';
            if(val !== 0) { 
                totalAdj += val; 
                rowsAdj += `<tr><td class="cogs-indent-2">${label}</td><td class="col-detail">${formatCogsRupiah(val)}</td><td></td></tr>`; 
            }
        });
        
        if(totalAdj !== 0){
             html += `
                <tr><td colspan="3" class="cogs-header" style="padding-top:15px; font-size:0.9rem;">PENYESUAIAN LAINNYA (ADJUSTMENTS)</td></tr>
                ${rowsAdj}
                <tr class="cogs-subtotal-line"><td class="cogs-indent-1">Total Penyesuaian</td><td></td><td class="col-detail">${formatCogsRupiah(totalAdj)}</td></tr>
            `;
        }

        // --- FINAL GRAND TOTAL COGS ---
        const finalCOGS = cogsBeforeAdj + totalAdj;

        html += `
            <tr><td colspan="3" style="height:25px;"></td></tr>
            <tr class="cogs-grand-total">
                <td colspan="2" style="padding-left:20px;">TOTAL HARGA POKOK PENJUALAN (COGS)</td>
                <td class="col-total" style="font-size:1.2rem;">${formatCogsRupiah(finalCOGS)}</td>
            </tr>
        `;

        if(cogsTableBody) cogsTableBody.innerHTML = html;

        // Return data for AI analysis
        return { 
            rmUsed, totalDL, totalFOH, totalMfgCosts, cogm, finalCOGS,
            rmPercentage: (rmUsed / totalMfgCosts * 100) || 0,
            dlPercentage: (totalDL / totalMfgCosts * 100) || 0,
            fohPercentage: (totalFOH / totalMfgCosts * 100) || 0
        };
    };

    if(cogsPreviewBtn) {
        cogsPreviewBtn.addEventListener('click', refreshCogsPreview);
    }

    // --- 3. SUBMIT & SMART PDF GENERATION ---
  // --- 3. SUBMIT & FIXED PDF GENERATION ---
    if(cogsForm) {
        cogsForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = refreshCogsPreview();

            if(cogsLoading) cogsLoading.style.display = 'block';

            // Prompt AI (Tetap Sama)
            const prompt = `
                Bertindak sebagai Akuntan Biaya Senior. Analisis Laporan HPP Manufaktur berikut:
                
                Data Biaya Produksi:
                - Bahan Baku Digunakan: Rp ${data.rmUsed.toLocaleString('id-ID')} (${data.rmPercentage.toFixed(1)}%)
                - Tenaga Kerja Langsung: Rp ${data.totalDL.toLocaleString('id-ID')} (${data.dlPercentage.toFixed(1)}%)
                - Overhead Pabrik: Rp ${data.totalFOH.toLocaleString('id-ID')} (${data.fohPercentage.toFixed(1)}%)
                - Total Biaya Produksi: Rp ${data.totalMfgCosts.toLocaleString('id-ID')}
                
                Hasil Akhir:
                - Harga Pokok Produksi (COGM): Rp ${data.cogm.toLocaleString('id-ID')}
                - Harga Pokok Penjualan (COGS): Rp ${data.finalCOGS.toLocaleString('id-ID')}
                
                Tugas:
                1. Evaluasi struktur biaya (komponen mana yang paling dominan).
                2. Berikan 2 saran strategis untuk efisiensi HPP.
                Gunakan bahasa profesional paragraf.
            `;

            try {
                // Fetch API (Sesuaikan URL)
                fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
                const apiData = await response.json();
                
                if(apiData.candidates && cogsAiContent) {
                    const aiText = apiData.candidates[0].content.parts[0].text;
                    cogsAiContent.innerHTML = marked.parse(aiText);
                    if(cogsAiSection) cogsAiSection.style.display = 'block';
                }
            } catch (err) {
                console.error("AI Error", err);
                if(cogsAiContent) cogsAiContent.innerHTML = "Analisis AI tidak tersedia.";
                if(cogsAiSection) cogsAiSection.style.display = 'block';
            } finally {
                if(cogsLoading) cogsLoading.style.display = 'none';
            }

            // === REVISI BAGIAN PDF AGAR TIDAK TERPOTONG / HITAM ===
            setTimeout(async () => {
                const element = document.getElementById('cogs-printable-area');
                
                // 1. Konfigurasi html2canvas untuk menghindari background hitam & isu scroll
                const canvas = await html2canvas(element, { 
                    scale: 2,                // Resolusi tinggi
                    useCORS: true,           // Izin akses gambar
                    logging: false,
                    backgroundColor: '#ffffff', // PENTING: Paksa background putih (Hapus garis hitam)
                    scrollY: -window.scrollY,   // PENTING: Fix posisi agar tidak terpotong saat discroll
                    windowWidth: document.documentElement.offsetWidth,
                    windowHeight: document.documentElement.offsetHeight
                });

                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                
                // 2. Setup A4 (Portrait)
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = 210; 
                const pdfHeight = 297; 
                
                // 3. Hitung dimensi gambar proporsional
                const imgProps = pdf.getImageProperties(imgData);
                const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                let heightLeft = imgHeight;
                let position = 0;

                // 4. Halaman Pertama
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;

                // 5. Loop Halaman Berikutnya (Jika konten panjang)
                while (heightLeft > 0) {
                    position = position - pdfHeight; // Geser posisi gambar ke atas untuk halaman baru
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                    heightLeft -= pdfHeight;
                }
                
                const dateStr = new Date().toISOString().slice(0,10);
                pdf.save(`Laporan_HPP_Detail_${dateStr}.pdf`);
            }, 1000); 
        });
    }


// ===== EQUITY STATEMENT GENERATOR SCRIPT =====

    // DOM Elements
    const eqForm = document.getElementById('equity-form');
    const eqPreviewBtn = document.getElementById('btn-preview-eq');
    const eqTableBody = document.getElementById('eq-table-body');
    
    // Header & Identitas
    const eqCompName = document.getElementById('eq_company_name');
    const eqReportDate = document.getElementById('eq_report_date');
    const eqCompDisplay = document.getElementById('eq-company-name-display');
    const eqDateDisplay = document.getElementById('eq-date-display');

    // Inputs Utama
    const inpScBeg = document.getElementById('eq_sc_beg');
    const inpScIssued = document.getElementById('eq_sc_issued');
    const inpScBuyback = document.getElementById('eq_sc_buyback');
    const inpReBeg = document.getElementById('eq_re_beg');
    const inpNetIncome = document.getElementById('eq_net_income');
    const inpDividends = document.getElementById('eq_dividends');

    // AI & Loading
    const eqLoading = document.getElementById('eq-loading-overlay');
    const eqAiSection = document.getElementById('eq-ai-section');
    const eqAiContent = document.getElementById('eq-ai-content');

    // --- 1. HELPERS & DYNAMIC ROWS ---
    window.addEqRow = function(containerId, itemClass) {
        const container = document.getElementById(containerId);
        const div = document.createElement('div');
        div.className = 'dynamic-row fade-in-up';
        
        div.innerHTML = `
            <input type="text" class="input-label" placeholder="Nama Penyesuaian" required>
            <input type="text" class="input-nominal ${itemClass}" placeholder="Rp 0" required>
            <button type="button" class="btn-del-row" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>
        `;
        container.appendChild(div);
        if(window.attachFormatters) window.attachFormatters(); 
    };

    function getEqVal(el) {
        if (!el) return 0;
        let valStr = el.value.replace(/\./g, '');
        // Handle negative explicitly if typed
        let multiplier = 1;
        if(valStr.includes('-')) {
            multiplier = -1;
            valStr = valStr.replace('-', '');
        }
        return (parseFloat(valStr) || 0) * multiplier;
    }

    function formatEqRupiah(num, isNegative = false) {
        if (num < 0 || isNegative) {
             return `(Rp ${Math.abs(num).toLocaleString('id-ID')})`;
        }
        return `Rp ${num.toLocaleString('id-ID')}`;
    }

    // --- 2. CALCULATION & PREVIEW ---
    window.refreshEqPreview = function() {
        // Update Header
        if(eqCompName && eqCompDisplay) eqCompDisplay.textContent = eqCompName.value.trim() || "NAMA PERUSAHAAN";
        if(eqReportDate && eqDateDisplay) {
            const dateVal = eqReportDate.value ? new Date(eqReportDate.value) : new Date();
            eqDateDisplay.textContent = dateVal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        let html = '';

        // --- SECTION 1: MODAL SAHAM ---
        const scBeg = getEqVal(inpScBeg);
        const scIssued = getEqVal(inpScIssued);
        const scBuyback = getEqVal(inpScBuyback); // Input positif, tapi logic dikurang
        const scEnd = scBeg + scIssued - scBuyback;

        html += `
            <tr><td colspan="2" class="eq-header-row" style="padding-top:10px;">1. MODAL SAHAM (SHARE CAPITAL)</td></tr>
            <tr><td style="padding-left:20px;">Saldo Awal</td><td class="row-amount">${formatEqRupiah(scBeg)}</td></tr>
            <tr><td style="padding-left:20px;">Penerbitan Saham Baru</td><td class="row-amount">${formatEqRupiah(scIssued)}</td></tr>
            <tr><td style="padding-left:20px;">Pembelian Saham Treasury (-)</td><td class="row-amount" style="color:#d946ef;">${formatEqRupiah(scBuyback, true)}</td></tr>
            <tr class="eq-subtotal-row"><td style="padding-left:20px;">Saldo Akhir Modal Saham</td><td class="row-amount">${formatEqRupiah(scEnd)}</td></tr>
        `;

        // --- SECTION 2: SALDO LABA ---
        const reBeg = getEqVal(inpReBeg);
        const netIncome = getEqVal(inpNetIncome);
        const dividends = getEqVal(inpDividends); // Input positif, logic dikurang
        const reEnd = reBeg + netIncome - dividends;

        html += `
            <tr><td colspan="2" style="height:20px;"></td></tr>
            <tr><td colspan="2" class="eq-header-row">2. SALDO LABA (RETAINED EARNINGS)</td></tr>
            <tr><td style="padding-left:20px;">Saldo Awal</td><td class="row-amount">${formatEqRupiah(reBeg)}</td></tr>
            <tr><td style="padding-left:20px;">Laba Bersih Tahun Berjalan</td><td class="row-amount">${formatEqRupiah(netIncome)}</td></tr>
            <tr><td style="padding-left:20px;">Dividen Tunai (-)</td><td class="row-amount" style="color:#d946ef;">${formatEqRupiah(dividends, true)}</td></tr>
            <tr class="eq-subtotal-row"><td style="padding-left:20px;">Saldo Akhir Saldo Laba</td><td class="row-amount">${formatEqRupiah(reEnd)}</td></tr>
        `;

        // --- SECTION 3: PENYESUAIAN LAINNYA ---
        let totalAdj = 0;
        let rowsAdj = '';
        document.querySelectorAll('.eq-adj-item').forEach(el => {
            const val = getEqVal(el);
            const label = el.previousElementSibling.value || 'Penyesuaian';
            if(val !== 0) { 
                totalAdj += val; 
                rowsAdj += `<tr><td style="padding-left:20px;">${label}</td><td class="row-amount">${formatEqRupiah(val)}</td></tr>`; 
            }
        });

        if (totalAdj !== 0 || rowsAdj !== '') {
            html += `
                <tr><td colspan="2" style="height:20px;"></td></tr>
                <tr><td colspan="2" class="eq-header-row">3. PENGHASILAN KOMPREHENSIF LAINNYA</td></tr>
                ${rowsAdj}
                <tr class="eq-subtotal-row"><td style="padding-left:20px;">Total Penyesuaian Lain</td><td class="row-amount">${formatEqRupiah(totalAdj)}</td></tr>
            `;
        }

        // --- GRAND TOTAL ---
        const totalEquityBeg = scBeg + reBeg; // Simplifikasi (hanya komponen utama)
        const totalEquityEnd = scEnd + reEnd + totalAdj;
        const changeInEquity = totalEquityEnd - totalEquityBeg;

        html += `
            <tr><td colspan="2" style="height:30px;"></td></tr>
            <tr class="eq-grand-total">
                <td style="padding-left:20px;">TOTAL EKUITAS AKHIR PERIODE</td>
                <td class="row-amount">${formatEqRupiah(totalEquityEnd)}</td>
            </tr>
        `;

        if(eqTableBody) eqTableBody.innerHTML = html;

        return { scEnd, reEnd, totalEquityEnd, netIncome, dividends, changeInEquity };
    };

    if(eqPreviewBtn) {
        eqPreviewBtn.addEventListener('click', refreshEqPreview);
    }

    // --- 3. SUBMIT, AI, & ROBUST PDF GENERATION ---
 // --- 3. SUBMIT, AI, & MARGIN PDF GENERATION ---
    if(eqForm) {
        eqForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = refreshEqPreview();

            if(eqLoading) eqLoading.style.display = 'block';

            // --- BAGIAN AI (TETAP SAMA) ---
            const prompt = `
                Sebagai Konsultan Keuangan, analisis Laporan Perubahan Ekuitas ini:
                - Modal Saham Akhir: Rp ${data.scEnd.toLocaleString('id-ID')}
                - Saldo Laba Akhir: Rp ${data.reEnd.toLocaleString('id-ID')}
                - Total Ekuitas: Rp ${data.totalEquityEnd.toLocaleString('id-ID')}
                
                Berikan evaluasi pertumbuhan modal dan kebijakan dividen.
            `;

            try {
                // Pastikan API_URL sudah ada di script global
             fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
                const apiData = await response.json();
                
                if(apiData.candidates && eqAiContent) {
                    const aiText = apiData.candidates[0].content.parts[0].text;
                    eqAiContent.innerHTML = marked.parse(aiText);
                    if(eqAiSection) eqAiSection.style.display = 'block';
                }
            } catch (err) {
                console.error("AI Error", err);
                if(eqAiContent) eqAiContent.innerHTML = "Analisis AI tidak tersedia.";
                if(eqAiSection) eqAiSection.style.display = 'block';
            } finally {
                if(eqLoading) eqLoading.style.display = 'none';
            }

            // --- REVISI PDF DENGAN MARGIN ATAS & BAWAH ---
            setTimeout(async () => {
                const element = document.getElementById('eq-printable-area');
                
                const canvas = await html2canvas(element, { 
                    scale: 2, 
                    useCORS: true, 
                    logging: false,
                    backgroundColor: '#ffffff', // Latar putih wajib
                    scrollY: -window.scrollY,
                    windowWidth: document.documentElement.offsetWidth,
                    windowHeight: document.documentElement.offsetHeight
                });

                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                
                // Konfigurasi A4
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = 210; 
                const pdfHeight = 297; 
                
                // Konfigurasi Margin (20mm Atas, 20mm Bawah)
                const marginTop = 20;
                const marginBottom = 20;
                const contentHeightPerPage = pdfHeight - marginTop - marginBottom; // Tinggi area aman untuk konten

                // Hitung total tinggi gambar asli dalam satuan PDF
                const imgProps = pdf.getImageProperties(imgData);
                const totalImgHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                let heightLeft = totalImgHeight;
                let position = 0; // Posisi Y gambar (akan bergeser negatif)

                // --- HALAMAN PERTAMA ---
                // Gambar dimulai dari marginTop (y=20), bukan dari ujung atas (y=0)
                pdf.addImage(imgData, 'PNG', 0, marginTop, pdfWidth, totalImgHeight);
                
                // Kurangi sisa tinggi gambar dengan "Area Aman" yang sudah terpakai
                heightLeft -= contentHeightPerPage;

                // --- LOOP HALAMAN BERIKUTNYA ---
                while (heightLeft > 0) {
                    // Geser posisi gambar ke atas sejauh area aman halaman sebelumnya
                    position -= contentHeightPerPage; 
                    
                    pdf.addPage();
                    // Pada halaman baru, gambar tetap dimulai dari marginTop, tapi posisinya sudah digeser (negatif)
                    // Rumus: marginTop + position (position bernilai negatif)
                    pdf.addImage(imgData, 'PNG', 0, marginTop + position, pdfWidth, totalImgHeight);
                    
                    heightLeft -= contentHeightPerPage;
                }
                
                pdf.save(`Perubahan_Modal_${new Date().toISOString().slice(0,10)}.pdf`);
            }, 1000); 
        });
    }

// ===== COST OF REVENUE (COR) GENERATOR SCRIPT =====

    // DOM Elements
    const corForm = document.getElementById('cor-form');
    const corPreviewBtn = document.getElementById('btn-preview-cor');
    const corTableBody = document.getElementById('cor-table-body');
    
    // Header & Identitas
    const corCompName = document.getElementById('cor_company_name');
    const corReportDate = document.getElementById('cor_report_date');
    const corCompDisplay = document.getElementById('cor-company-name-display');
    const corDateDisplay = document.getElementById('cor-date-display');

    // Inputs Utama
    const inpRevenue = document.getElementById('cor_total_revenue');

    // AI & Loading
    const corLoading = document.getElementById('cor-loading-overlay');
    const corAiSection = document.getElementById('cor-ai-section');
    const corAiContent = document.getElementById('cor-ai-content');

    // --- 1. HELPERS & DYNAMIC ROWS ---
    window.addCorRow = function(containerId, itemClass) {
        const container = document.getElementById(containerId);
        const div = document.createElement('div');
        div.className = 'dynamic-row fade-in-up';
        
        let placeholder = "Rincian Biaya";
        if(itemClass === 'infra-item') placeholder = "Biaya Server/Hosting";
        if(itemClass === 'license-item') placeholder = "Biaya API/Lisensi";
        if(itemClass === 'support-item') placeholder = "Biaya Tim Support";

        div.innerHTML = `
            <input type="text" class="input-label" placeholder="${placeholder}" required>
            <input type="text" class="input-nominal ${itemClass}" placeholder="Rp 0" required>
            <button type="button" class="btn-del-row" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>
        `;
        container.appendChild(div);
        if(window.attachFormatters) window.attachFormatters(); 
    };

    function getCorVal(el) {
        if (!el) return 0;
        return parseFloat(el.value.replace(/\./g, '')) || 0;
    }

    function formatCorRupiah(num) {
        return `Rp ${num.toLocaleString('id-ID')}`;
    }

    // --- 2. CALCULATION & PREVIEW ---
    window.refreshCorPreview = function() {
        // Update Header
        if(corCompName && corCompDisplay) corCompDisplay.textContent = corCompName.value.trim() || "NAMA PERUSAHAAN";
        if(corReportDate && corDateDisplay) {
            const dateVal = corReportDate.value ? new Date(corReportDate.value) : new Date();
            corDateDisplay.textContent = dateVal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        let html = '';
        const revenue = getCorVal(inpRevenue);

        // Header Revenue
        html += `
            <tr class="cor-header-row"><td colspan="3">PENDAPATAN (REVENUE)</td></tr>
            <tr>
                <td style="padding-left:20px;">Total Pendapatan Layanan</td>
                <td></td>
                <td class="col-total" style="font-size:1.1rem;">${formatCorRupiah(revenue)}</td>
            </tr>
            <tr><td colspan="3" style="height:20px;"></td></tr>
            <tr class="cor-header-row"><td colspan="3">RINCIAN BIAYA PENDAPATAN (COST OF REVENUE)</td></tr>
        `;

        // Function to process sections
        function processSection(className, title) {
            let total = 0;
            let rows = '';
            document.querySelectorAll('.' + className).forEach(el => {
                const val = getCorVal(el);
                const label = el.previousElementSibling.value || 'Biaya';
                if(val > 0) { 
                    total += val; 
                    const percent = (revenue > 0) ? ((val/revenue)*100).toFixed(1) + '%' : '-';
                    rows += `
                        <tr>
                            <td class="cogs-indent-1">${label}</td>
                            <td class="cor-percentage">${percent} of Rev</td>
                            <td class="col-detail">${formatCorRupiah(val)}</td>
                        </tr>`; 
                }
            });
            if(total > 0) {
                 html += `
                    <tr><td colspan="3" style="font-weight:bold; padding-top:10px; padding-left:5px; color:#0891b2;">${title}</td></tr>
                    ${rows}
                    <tr class="cor-subtotal-line"><td style="padding-left:20px;">Subtotal ${title}</td><td></td><td class="col-total">${formatCorRupiah(total)}</td></tr>
                `;
            }
            return total;
        }

        // Process Groups
        const totalInfra = processSection('infra-item', 'Infrastruktur & Hosting');
        const totalLicense = processSection('license-item', 'Lisensi & Pihak Ke-3');
        const totalSupport = processSection('support-item', 'Customer Support & Success');

        const totalCOR = totalInfra + totalLicense + totalSupport;
        const grossProfit = revenue - totalCOR;
        const grossMargin = (revenue > 0) ? ((grossProfit / revenue) * 100).toFixed(1) : 0;

        // TOTAL COR
        html += `
            <tr><td colspan="3" style="height:15px;"></td></tr>
            <tr class="cogs-section-total" style="background:#ecfeff; border-color:#06b6d4; color:#155e75;">
                <td style="padding-left:20px;">TOTAL COST OF REVENUE</td>
                <td class="cor-percentage" style="font-weight:bold;">${(revenue > 0 ? ((totalCOR/revenue)*100).toFixed(1)+'%' : '-')}</td>
                <td class="col-total">${formatCorRupiah(totalCOR)}</td>
            </tr>
            <tr><td colspan="3" style="height:30px;"></td></tr>
        `;

        // GROSS PROFIT & MARGIN
        html += `
            <tr class="cor-margin-row">
                <td style="padding-left:20px;">LABA KOTOR (GROSS PROFIT)</td>
                <td></td>
                <td class="col-total" style="font-size:1.2rem; color:#166534;">${formatCorRupiah(grossProfit)}</td>
            </tr>
             <tr class="cor-margin-row" style="background:white; border:none; color:#333;">
                <td style="padding-left:20px;">Gross Margin (%)</td>
                <td></td>
                <td class="col-total" style="font-size:1.2rem;">${grossMargin}%</td>
            </tr>
        `;

        if(corTableBody) corTableBody.innerHTML = html;

        return { revenue, totalCOR, grossProfit, grossMargin, totalInfra, totalSupport };
    };

    if(corPreviewBtn) {
        corPreviewBtn.addEventListener('click', refreshCorPreview);
    }

    // --- 3. SUBMIT WITH ROBUST PDF MARGINS ---
   // --- 3. SUBMIT & FIXED PDF GENERATION (ANTI-DUPLICATE) ---
    if(corForm) {
        corForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = refreshCorPreview();

            if(corLoading) corLoading.style.display = 'block';

            // --- BAGIAN AI (TETAP SAMA) ---
            const prompt = `
                Sebagai CTO/CFO Perusahaan SaaS, analisis Laporan Cost of Revenue (COR) ini:
                - Revenue: Rp ${data.revenue.toLocaleString('id-ID')}
                - Total COR: Rp ${data.totalCOR.toLocaleString('id-ID')}
                - Gross Margin: ${data.grossMargin}%
                
                Berikan 1 paragraf analisis efisiensi biaya hosting dan support.
            `;

            try {
                // Fetch AI (Kode sama)
              fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
                const apiData = await response.json();
                
                if(apiData.candidates && corAiContent) {
                    const aiText = apiData.candidates[0].content.parts[0].text;
                    corAiContent.innerHTML = marked.parse(aiText);
                    if(corAiSection) corAiSection.style.display = 'block';
                }
            } catch (err) {
                console.error("AI Error", err);
                if(corAiContent) corAiContent.innerHTML = "Analisis AI tidak tersedia.";
                if(corAiSection) corAiSection.style.display = 'block';
            } finally {
                if(corLoading) corLoading.style.display = 'none';
            }

            // --- REVISI PDF GENERATION (DENGAN WHITE MASK) ---
            setTimeout(async () => {
                const element = document.getElementById('cor-printable-area');
                
                const canvas = await html2canvas(element, { 
                    scale: 2, 
                    useCORS: true, 
                    logging: false,
                    backgroundColor: '#ffffff', 
                    scrollY: -window.scrollY,
                    windowWidth: document.documentElement.offsetWidth,
                    windowHeight: document.documentElement.offsetHeight
                });

                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                
                // Konfigurasi Kertas A4
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = 210; 
                const pdfHeight = 297; 
                
                // Margin Settings (20mm Atas/Bawah)
                const marginTop = 20;
                const marginBottom = 20;
                
                // Tinggi Konten Efektif per Halaman
                const contentHeightPerPage = pdfHeight - marginTop - marginBottom; 

                const imgProps = pdf.getImageProperties(imgData);
                const totalImgHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                let heightLeft = totalImgHeight;
                let position = 0; // Posisi Y geser gambar

                // --- HALAMAN 1 ---
                // Gambar dimulai dari margin atas
                pdf.addImage(imgData, 'PNG', 0, marginTop, pdfWidth, totalImgHeight);
                
                // MASKING BAWAH: Tutup area yang 'tumpah' ke margin bawah dengan kotak putih
                pdf.setFillColor(255, 255, 255); // Warna Putih
                pdf.rect(0, pdfHeight - marginBottom, pdfWidth, marginBottom, 'F'); // Gambar kotak putih di margin bawah

                heightLeft -= contentHeightPerPage;

                // --- HALAMAN SELANJUTNYA ---
                while (heightLeft > 5) { // Threshold 5mm untuk menghindari halaman kosong
                    position -= contentHeightPerPage; 
                    
                    pdf.addPage();
                    // Gambar digeser ke atas sejauh konten halaman sebelumnya
                    // Dimulai dari marginTop + (posisi negatif)
                    pdf.addImage(imgData, 'PNG', 0, marginTop + position, pdfWidth, totalImgHeight);
                    
                    // MASKING ATAS (Opsional, tapi aman): Tutup margin atas
                    pdf.setFillColor(255, 255, 255);
                    pdf.rect(0, 0, pdfWidth, marginTop, 'F');

                    // MASKING BAWAH: Tutup margin bawah
                    pdf.setFillColor(255, 255, 255);
                    pdf.rect(0, pdfHeight - marginBottom, pdfWidth, marginBottom, 'F');
                    
                    heightLeft -= contentHeightPerPage;
                }
                
                pdf.save(`COR_Analysis_${new Date().toISOString().slice(0,10)}.pdf`);
            }, 1000); 
        });
    }
// ===== OPEX BREAKDOWN GENERATOR SCRIPT =====

    // DOM Elements
    const opexForm = document.getElementById('opex-form');
    const opexPreviewBtn = document.getElementById('btn-preview-opex');
    const opexTableBody = document.getElementById('opex-table-body');
    
    // Header
    const opexCompName = document.getElementById('opex_company_name');
    const opexReportDate = document.getElementById('opex_report_date');
    const opexCompDisplay = document.getElementById('opex-company-name-display');
    const opexDateDisplay = document.getElementById('opex-date-display');

    // AI & Loading
    const opexLoading = document.getElementById('opex-loading-overlay');
    const opexAiSection = document.getElementById('opex-ai-section');
    const opexAiContent = document.getElementById('opex-ai-content');

    // --- 1. HELPERS & DYNAMIC ROWS ---
    window.addOpexRow = function(containerId, itemClass) {
        const container = document.getElementById(containerId);
        const div = document.createElement('div');
        div.className = 'dynamic-row fade-in-up';
        
        div.innerHTML = `
            <input type="text" class="input-label" placeholder="Nama Akun Biaya" required>
            <input type="text" class="input-nominal ${itemClass}" placeholder="Rp 0" required>
            <button type="button" class="btn-del-row" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>
        `;
        container.appendChild(div);
        if(window.attachFormatters) window.attachFormatters(); 
    };

    function getOpexVal(el) {
        if (!el) return 0;
        return parseFloat(el.value.replace(/\./g, '')) || 0;
    }

    function formatOpexRupiah(num) {
        return `Rp ${num.toLocaleString('id-ID')}`;
    }

    // --- 2. CALCULATION & PREVIEW ---
    window.refreshOpexPreview = function() {
        // Update Header
        if(opexCompName && opexCompDisplay) opexCompDisplay.textContent = opexCompName.value.trim() || "NAMA PERUSAHAAN";
        if(opexReportDate && opexDateDisplay) {
            const dateVal = opexReportDate.value ? new Date(opexReportDate.value) : new Date();
            opexDateDisplay.textContent = dateVal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        // 1. Calculate Grand Total First (untuk Persentase Pareto)
        let grandTotal = 0;
        document.querySelectorAll('.sm-item, .rnd-item, .ga-item').forEach(el => {
            grandTotal += getOpexVal(el);
        });

        let html = `
            <tr class="opex-header-row">
                <td style="padding-left:10px;">Kategori / Akun</td>
                <td class="opex-percent-col">% Total</td>
                <td class="col-total">Nominal</td>
            </tr>
        `;

        // Helper to process sections
        function processSection(className, title, badgeColor) {
            let total = 0;
            let rows = '';
            const items = [];

            // Collect Data
            document.querySelectorAll('.' + className).forEach(el => {
                const val = getOpexVal(el);
                const label = el.previousElementSibling.value || 'Biaya';
                if(val > 0) { 
                    total += val;
                    items.push({ label, val });
                }
            });

            // Sort by Value Descending (Pareto-ish view within category)
            items.sort((a, b) => b.val - a.val);

            // Generate Rows
            items.forEach(item => {
                const percent = (grandTotal > 0) ? ((item.val / grandTotal) * 100).toFixed(1) + '%' : '0%';
                // Highlight jika biaya > 10% total (Potensi Inefisiensi)
                const style = (item.val / grandTotal > 0.1) ? 'color:#d97706; font-weight:bold;' : '';
                
                rows += `
                    <tr>
                        <td class="cogs-indent-1" style="${style}">${item.label}</td>
                        <td class="opex-percent-col">${percent}</td>
                        <td class="col-detail">${formatOpexRupiah(item.val)}</td>
                    </tr>`;
            });

            if(total > 0) {
                 html += `
                    <tr><td colspan="3" style="font-weight:bold; padding-top:15px; padding-left:5px; color:#333;">${title}</td></tr>
                    ${rows}
                    <tr class="opex-subtotal-row"><td style="padding-left:20px;">Subtotal ${title}</td><td></td><td class="col-total">${formatOpexRupiah(total)}</td></tr>
                `;
            }
            return { total, items };
        }

        const dataSM = processSection('sm-item', '1. Penjualan & Pemasaran');
        const dataRND = processSection('rnd-item', '2. Riset & Pengembangan');
        const dataGA = processSection('ga-item', '3. Umum & Administrasi');

        // GRAND TOTAL
        html += `
            <tr><td colspan="3" style="height:20px;"></td></tr>
            <tr class="opex-grand-total">
                <td style="padding-left:20px;">TOTAL OPEX</td>
                <td class="opex-percent-col">100%</td>
                <td class="col-total" style="font-size:1.2rem;">${formatOpexRupiah(grandTotal)}</td>
            </tr>
        `;

        if(opexTableBody) opexTableBody.innerHTML = html;

        return { grandTotal, dataSM, dataRND, dataGA };
    };

    if(opexPreviewBtn) {
        opexPreviewBtn.addEventListener('click', refreshOpexPreview);
    }

    // --- 3. SUBMIT & PERFECT PDF GENERATION ---
    if(opexForm) {
        opexForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = refreshOpexPreview();

            if(opexLoading) opexLoading.style.display = 'block';

            // Prompt AI: Fokus ke Pareto & Inefisiensi
            const prompt = `
                Sebagai Konsultan Efisiensi Bisnis, analisis Laporan OPEX ini:
                - Total OPEX: Rp ${data.grandTotal.toLocaleString('id-ID')}
                - Pemasaran (S&M): Rp ${data.dataSM.total.toLocaleString('id-ID')}
                - R&D: Rp ${data.dataRND.total.toLocaleString('id-ID')}
                - G&A: Rp ${data.dataGA.total.toLocaleString('id-ID')}
                
                Identifikasi pos biaya terbesar (Pareto Principle). Berikan 3 strategi cost-cutting tanpa mengorbankan kualitas produk/layanan.
            `;

            try {
                fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
                const apiData = await response.json();
                
                if(apiData.candidates && opexAiContent) {
                    const aiText = apiData.candidates[0].content.parts[0].text;
                    opexAiContent.innerHTML = marked.parse(aiText);
                    if(opexAiSection) opexAiSection.style.display = 'block';
                }
            } catch (err) {
                console.error("AI Error", err);
                if(opexAiContent) opexAiContent.innerHTML = "Analisis AI tidak tersedia.";
                if(opexAiSection) opexAiSection.style.display = 'block';
            } finally {
                if(opexLoading) opexLoading.style.display = 'none';
            }

            // PDF GENERATION (DENGAN WHITE MASK & SAFE MARGINS)
            setTimeout(async () => {
                const element = document.getElementById('opex-printable-area');
                
                const canvas = await html2canvas(element, { 
                    scale: 2, 
                    useCORS: true, 
                    logging: false,
                    backgroundColor: '#ffffff', 
                    scrollY: -window.scrollY,
                    windowWidth: document.documentElement.offsetWidth,
                    windowHeight: document.documentElement.offsetHeight
                });

                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = 210; 
                const pdfHeight = 297; 
                
                // Margin Settings
                const marginTop = 20;
                const marginBottom = 20;
                const contentHeightPerPage = pdfHeight - marginTop - marginBottom; 

                const imgProps = pdf.getImageProperties(imgData);
                const totalImgHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                let heightLeft = totalImgHeight;
                let position = 0; 

                // PAGE 1
                pdf.addImage(imgData, 'PNG', 0, marginTop, pdfWidth, totalImgHeight);
                
                // MASKING BAWAH HALAMAN 1 (Wajib agar tidak bocor)
                pdf.setFillColor(255, 255, 255); 
                pdf.rect(0, pdfHeight - marginBottom, pdfWidth, marginBottom, 'F'); 

                heightLeft -= contentHeightPerPage;

                // LOOP PAGES
                while (heightLeft > 5) { // Threshold 5mm
                    position -= contentHeightPerPage; 
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, marginTop + position, pdfWidth, totalImgHeight);
                    
                    // MASKING ATAS (Tutup header yang terulang)
                    pdf.setFillColor(255, 255, 255);
                    pdf.rect(0, 0, pdfWidth, marginTop, 'F');

                    // MASKING BAWAH (Tutup footer sisa)
                    pdf.setFillColor(255, 255, 255);
                    pdf.rect(0, pdfHeight - marginBottom, pdfWidth, marginBottom, 'F');
                    
                    heightLeft -= contentHeightPerPage;
                }
                
                pdf.save(`OPEX_Breakdown_${new Date().toISOString().slice(0,10)}.pdf`);
            }, 1000); 
        });
    }

// ===== CAPEX FEASIBILITY GENERATOR SCRIPT =====

    // DOM Elements
    const cxForm = document.getElementById('capex-form');
    const cxPreviewBtn = document.getElementById('btn-preview-capex');
    const cxTableBody = document.getElementById('cx-table-body');
    
    // Inputs & Displays
    const cxAssetName = document.getElementById('cx_asset_name');
    const cxStartDate = document.getElementById('cx_start_date');
    const cxInitialCost = document.getElementById('cx_initial_cost');
    const cxUsefulLife = document.getElementById('cx_useful_life');
    const cxSalvageValue = document.getElementById('cx_salvage_value');

    const dispName = document.getElementById('cx-asset-name-display');
    const dispDate = document.getElementById('cx-date-display');
    const dispInitial = document.getElementById('disp-initial-cost');
    const dispAnnual = document.getElementById('disp-annual-dep');
    const dispSalvage = document.getElementById('disp-salvage');

    // AI & Loading
    const cxLoading = document.getElementById('cx-loading-overlay');
    const cxAiSection = document.getElementById('cx-ai-section');
    const cxAiContent = document.getElementById('cx-ai-content');

    // --- 1. DYNAMIC ADJUSTMENT ROWS ---
    window.addCapexRow = function(containerId, itemClass) {
        const container = document.getElementById(containerId);
        const div = document.createElement('div');
        div.className = 'dynamic-row fade-in-up';
        
        div.innerHTML = `
            <input type="text" class="input-label" placeholder="Nama Penyesuaian" required>
            <input type="text" class="input-nominal ${itemClass}" placeholder="Rp 0" required>
            <button type="button" class="btn-del-row" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>
        `;
        container.appendChild(div);
        if(window.attachFormatters) window.attachFormatters(); 
    };

    function getCxVal(el) {
        if (!el) return 0;
        let valStr = el.value.replace(/\./g, '');
        let multiplier = 1;
        if(valStr.includes('-')) {
            multiplier = -1;
            valStr = valStr.replace('-', '');
        }
        return (parseFloat(valStr) || 0) * multiplier;
    }

    function formatCxRupiah(num) {
        return `Rp ${num.toLocaleString('id-ID')}`;
    }

    // --- 2. CALCULATION & PREVIEW ---
    window.refreshCapexPreview = function() {
        // Update Header
        if(cxAssetName && dispName) dispName.textContent = cxAssetName.value.trim() || "NAMA ASET / PROYEK";
        if(cxStartDate && dispDate) {
            const dateVal = cxStartDate.value ? new Date(cxStartDate.value) : new Date();
            dispDate.textContent = dateVal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        const cost = getCxVal(cxInitialCost);
        const life = parseFloat(cxUsefulLife.value) || 5;
        const salvage = getCxVal(cxSalvageValue);
        
        // Straight Line Depreciation
        const depreciableAmount = cost - salvage;
        const annualDep = depreciableAmount / life;

        // Update Summary Cards
        dispInitial.textContent = formatCxRupiah(cost);
        dispAnnual.textContent = formatCxRupiah(annualDep);
        dispSalvage.textContent = formatCxRupiah(salvage);

        // Calculate Adjustments (Net per year)
        let totalAdjPerYear = 0;
        document.querySelectorAll('.cx-adj-item').forEach(el => {
            totalAdjPerYear += getCxVal(el);
        });

        // Generate Table
        let html = `
            <tr class="cx-header-row">
                <td style="text-align:center;">Tahun Ke-</td>
                <td style="text-align:right;">Nilai Buku Awal</td>
                <td style="text-align:right;">Beban Depresiasi</td>
                <td style="text-align:right;">Akumulasi Dep.</td>
                <td style="text-align:right;">Nilai Buku Akhir</td>
            </tr>
        `;

        let currentBookValue = cost;
        let accumulatedDep = 0;

        // Year 0 (Investment)
        html += `
            <tr class="cx-data-row" style="background:#f1f5f9;">
                <td class="cx-year-col">0 (Now)</td>
                <td colspan="4" style="text-align:center; font-style:italic;">Investasi Awal: (${formatCxRupiah(cost)}) | Net Adj: ${formatCxRupiah(totalAdjPerYear)}</td>
            </tr>
        `;

        for (let i = 1; i <= life; i++) {
            // Adjust calculation for last year to match exactly salvage value if rounding errors occur
            let thisYearDep = annualDep;
            if (i === life) {
                thisYearDep = currentBookValue - salvage;
            }

            const openingVal = currentBookValue;
            currentBookValue -= thisYearDep;
            accumulatedDep += thisYearDep;

            html += `
                <tr class="cx-data-row">
                    <td class="cx-year-col">${i}</td>
                    <td style="text-align:right;">${formatCxRupiah(openingVal)}</td>
                    <td style="text-align:right; color:#dc2626;">(${formatCxRupiah(thisYearDep)})</td>
                    <td style="text-align:right;">${formatCxRupiah(accumulatedDep)}</td>
                    <td style="text-align:right; font-weight:bold;">${formatCxRupiah(currentBookValue)}</td>
                </tr>
            `;
        }

        if(cxTableBody) cxTableBody.innerHTML = html;
        return { cost, life, salvage, annualDep };
    };

    if(cxPreviewBtn) {
        cxPreviewBtn.addEventListener('click', refreshCapexPreview);
    }

    // --- 3. SUBMIT & PDF WITH WHITE MASKING ---
    if(cxForm) {
        cxForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = refreshCapexPreview();

            if(cxLoading) cxLoading.style.display = 'block';

            // AI Prompt
            const prompt = `
                Sebagai Analis Investasi, evaluasi rencana CapEx ini:
                - Aset: ${cxAssetName.value}
                - Harga Perolehan: Rp ${data.cost.toLocaleString('id-ID')}
                - Masa Manfaat: ${data.life} Tahun
                - Depresiasi Tahunan: Rp ${data.annualDep.toLocaleString('id-ID')}
                - Nilai Sisa: Rp ${data.salvage.toLocaleString('id-ID')}
                
                Tugas:
                1. Apakah masa manfaat ${data.life} tahun wajar untuk aset jenis ini?
                2. Analisis dampak arus kas dari beban depresiasi (tax shield).
                3. Berikan saran maintenance asset agar nilai sisa tercapai.
            `;

            try {
               fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
                const apiData = await response.json();
                
                if(apiData.candidates && cxAiContent) {
                    const aiText = apiData.candidates[0].content.parts[0].text;
                    cxAiContent.innerHTML = marked.parse(aiText);
                    if(cxAiSection) cxAiSection.style.display = 'block';
                }
            } catch (err) {
                console.error("AI Error", err);
                if(cxAiContent) cxAiContent.innerHTML = "Analisis AI tidak tersedia.";
                if(cxAiSection) cxAiSection.style.display = 'block';
            } finally {
                if(cxLoading) cxLoading.style.display = 'none';
            }

           // --- PDF GENERATION (TEKNIK MASKING SEPERTI CONTRIBUTION MARGIN) ---
            setTimeout(async () => {
                const element = document.getElementById('cx-printable-area');
                
                const canvas = await html2canvas(element, { 
                    scale: 2, 
                    useCORS: true, 
                    logging: false,
                    backgroundColor: '#ffffff', // Wajib putih
                    scrollY: -window.scrollY,   // Fix posisi scroll
                    windowWidth: document.documentElement.offsetWidth,
                    windowHeight: document.documentElement.offsetHeight
                });

                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                
                // Setup A4
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = 210; 
                const pdfHeight = 297; 
                
                // Margin Aman (20mm Atas & Bawah)
                const marginTop = 20;
                const marginBottom = 20;
                const contentHeightPerPage = pdfHeight - marginTop - marginBottom; 

                const imgProps = pdf.getImageProperties(imgData);
                const totalImgHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                let heightLeft = totalImgHeight;
                let position = 0; 

                // --- HALAMAN 1 ---
                // Gambar dimulai dari margin atas (y = 20)
                pdf.addImage(imgData, 'PNG', 0, marginTop, pdfWidth, totalImgHeight);
                
                // MASKING BAWAH (Tutup sisa gambar yang 'tumpah' ke margin bawah)
                pdf.setFillColor(255, 255, 255); 
                pdf.rect(0, pdfHeight - marginBottom, pdfWidth, marginBottom, 'F'); 

                heightLeft -= contentHeightPerPage;

                // --- LOOP HALAMAN BERIKUTNYA ---
                while (heightLeft > 5) { // Threshold 5mm
                    position -= contentHeightPerPage; 
                    
                    pdf.addPage();
                    // Gambar digeser ke atas (posisi negatif) + margin top
                    pdf.addImage(imgData, 'PNG', 0, marginTop + position, pdfWidth, totalImgHeight);
                    
                    // MASKING ATAS (Tutup header/konten halaman sebelumnya yang 'tumpah' ke atas)
                    pdf.setFillColor(255, 255, 255);
                    pdf.rect(0, 0, pdfWidth, marginTop, 'F');

                    // MASKING BAWAH (Tutup footer sisa)
                    pdf.setFillColor(255, 255, 255);
                    pdf.rect(0, pdfHeight - marginBottom, pdfWidth, marginBottom, 'F');
                    
                    heightLeft -= contentHeightPerPage;
                }
                
                pdf.save(`CapEx_Feasibility_${new Date().toISOString().slice(0,10)}.pdf`);
            }, 1000); 
        });
    }


    // ===== CONTRIBUTION MARGIN GENERATOR SCRIPT =====

    // DOM Elements
    const cmForm = document.getElementById('cm-form');
    const cmPreviewBtn = document.getElementById('btn-preview-cm');
    const cmTableBody = document.getElementById('cm-table-body');
    const cmContainer = document.getElementById('cm-products-container');
    
    // Header
    const cmCompName = document.getElementById('cm_company_name');
    const cmReportDate = document.getElementById('cm_report_date');
    const cmCompDisplay = document.getElementById('cm-company-name-display');
    const cmDateDisplay = document.getElementById('cm-date-display');
    
    const inpFixedCost = document.getElementById('cm_total_fixed_cost');
    const displayTotalFixed = document.getElementById('display-total-fixed');
    const displayAvgRatio = document.getElementById('display-avg-ratio');

    // AI & Loading
    const cmLoading = document.getElementById('cm-loading-overlay');
    const cmAiSection = document.getElementById('cm-ai-section');
    const cmAiContent = document.getElementById('cm-ai-content');

    // --- 1. DYNAMIC PRODUCT ROWS ---
    window.addCmRow = function() {
        const div = document.createElement('div');
        div.className = 'product-card-input fade-in-up';
        
        // Count existing to number them
        const count = cmContainer.children.length + 1;

        div.innerHTML = `
            <div class="prod-header">
                <span>Produk #${count}</span>
                <button type="button" class="btn-del-prod" onclick="this.parentElement.parentElement.remove()"><i class="fas fa-trash"></i></button>
            </div>
            <div class="prod-body">
                <div class="dynamic-row">
                    <input type="text" class="input-label" value="Nama Produk" readonly>
                    <input type="text" class="input-text cm-prod-name" placeholder="Nama Produk">
                </div>
                <div class="dynamic-row">
                    <input type="text" class="input-label" value="Harga Jual" readonly>
                    <input type="text" class="input-nominal cm-price" placeholder="Rp 0">
                </div>
                <div class="dynamic-row">
                    <input type="text" class="input-label" value="Biaya Variabel" readonly>
                    <input type="text" class="input-nominal cm-var-cost" placeholder="Rp 0">
                </div>
            </div>
        `;
        cmContainer.appendChild(div);
        if(window.attachFormatters) window.attachFormatters(); 
    };

    function getCmVal(el) {
        if (!el) return 0;
        return parseFloat(el.value.replace(/\./g, '')) || 0;
    }

    function formatCmRupiah(num) {
        return `Rp ${num.toLocaleString('id-ID')}`;
    }

    // --- 2. CALCULATION & PREVIEW ---
    window.refreshCmPreview = function() {
        // Update Header
        if(cmCompName && cmCompDisplay) cmCompDisplay.textContent = cmCompName.value.trim() || "NAMA PERUSAHAAN";
        if(cmReportDate && cmDateDisplay) {
            const dateVal = cmReportDate.value ? new Date(cmReportDate.value) : new Date();
            cmDateDisplay.textContent = dateVal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        const fixedCost = getCmVal(inpFixedCost);
        displayTotalFixed.textContent = formatCmRupiah(fixedCost);

        let html = `
            <tr class="cm-header-row">
                <td style="padding-left:10px;">Produk</td>
                <td style="text-align:right;">Harga Jual</td>
                <td style="text-align:right;">Biaya Var.</td>
                <td style="text-align:right;">CM / Unit</td>
                <td style="text-align:right;">CM Ratio</td>
                <td style="text-align:right; background:#701a2e;">BEP (Unit)</td>
            </tr>
        `;

        let totalRatio = 0;
        let count = 0;
        let productAnalysis = [];

        const productCards = document.querySelectorAll('.product-card-input');
        
        productCards.forEach(card => {
            const name = card.querySelector('.cm-prod-name').value || 'Produk Tanpa Nama';
            const price = getCmVal(card.querySelector('.cm-price'));
            const varCost = getCmVal(card.querySelector('.cm-var-cost'));
            
            if (price > 0) {
                const cmPerUnit = price - varCost;
                const cmRatio = (cmPerUnit / price) * 100;
                
                // BEP (Unit) = Total Fixed Cost / CM per Unit
                // Note: Ini asumsi jika HANYA produk ini yang menutup fixed cost (Simulasi)
                const bepUnit = (cmPerUnit > 0) ? Math.ceil(fixedCost / cmPerUnit) : "∞";

                totalRatio += cmRatio;
                count++;
                
                productAnalysis.push({ name, cmRatio, cmPerUnit, bepUnit });

                html += `
                    <tr class="cm-data-row">
                        <td style="font-weight:bold; padding-left:10px;">${name}</td>
                        <td style="text-align:right;">${formatCmRupiah(price)}</td>
                        <td style="text-align:right;">${formatCmRupiah(varCost)}</td>
                        <td style="text-align:right; color:#059669; font-weight:bold;">${formatCmRupiah(cmPerUnit)}</td>
                        <td style="text-align:right;">${cmRatio.toFixed(1)}%</td>
                        <td class="cm-highlight" style="text-align:right;">${(typeof bepUnit === 'number') ? bepUnit.toLocaleString('id-ID') : bepUnit}</td>
                    </tr>
                `;
            }
        });

        // Calculate Average
        const avgRatio = count > 0 ? (totalRatio / count) : 0;
        displayAvgRatio.textContent = avgRatio.toFixed(1) + "%";

        // Footer note
        html += `
            <tr><td colspan="6" style="padding:15px; font-size:0.8rem; color:#666; font-style:italic;">
                *BEP (Unit) dihitung dengan asumsi seluruh Biaya Tetap (Rp ${fixedCost.toLocaleString('id-ID')}) ditutup oleh satu produk tersebut.
            </td></tr>
        `;

        if(cmTableBody) cmTableBody.innerHTML = html;
        return { fixedCost, avgRatio, productAnalysis };
    };

    if(cmPreviewBtn) {
        cmPreviewBtn.addEventListener('click', refreshCmPreview);
    }

    // --- 3. SUBMIT & PERFECT PDF GENERATION (MASKING TECHNIQUE) ---
    if(cmForm) {
        cmForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = refreshCmPreview();

            if(cmLoading) cmLoading.style.display = 'block';

            // Menyiapkan data untuk AI
            let prodDetails = data.productAnalysis.map(p => 
                `- ${p.name}: CM Ratio ${p.cmRatio.toFixed(1)}%, BEP ${p.bepUnit} unit`
            ).join('\n');

            const prompt = `
                Sebagai Analis Keuangan, berikan rekomendasi strategis berdasarkan laporan Contribution Margin ini:
                - Total Biaya Tetap: Rp ${data.fixedCost.toLocaleString('id-ID')}
                - Rata-rata CM Ratio: ${data.avgRatio.toFixed(1)}%
                
                Rincian Produk:
                ${prodDetails}
                
                Tugas:
                1. Produk mana yang paling efisien menutup biaya tetap (Champion)?
                2. Strategi harga apa yang disarankan untuk produk dengan CM rendah?
                3. Berikan saran bauran produk (product mix).
            `;

            try {
              fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
                const apiData = await response.json();
                
                if(apiData.candidates && cmAiContent) {
                    const aiText = apiData.candidates[0].content.parts[0].text;
                    cmAiContent.innerHTML = marked.parse(aiText);
                    if(cmAiSection) cmAiSection.style.display = 'block';
                }
            } catch (err) {
                console.error("AI Error", err);
                if(cmAiContent) cmAiContent.innerHTML = "Analisis AI tidak tersedia.";
                if(cmAiSection) cmAiSection.style.display = 'block';
            } finally {
                if(cmLoading) cmLoading.style.display = 'none';
            }

            // PDF GENERATION WITH MASKING (SOLUSI FINAL TTD GANDA)
            setTimeout(async () => {
                const element = document.getElementById('cm-printable-area');
                
                const canvas = await html2canvas(element, { 
                    scale: 2, 
                    useCORS: true, 
                    logging: false,
                    backgroundColor: '#ffffff', 
                    scrollY: -window.scrollY,
                    windowWidth: document.documentElement.offsetWidth,
                    windowHeight: document.documentElement.offsetHeight
                });

                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = 210; 
                const pdfHeight = 297; 
                
                // Margin Settings
                const marginTop = 20;
                const marginBottom = 20;
                const contentHeightPerPage = pdfHeight - marginTop - marginBottom; 

                const imgProps = pdf.getImageProperties(imgData);
                const totalImgHeight = (imgProps.height * pdfWidth) / imgProps.width;
                
                let heightLeft = totalImgHeight;
                let position = 0; 

                // PAGE 1
                pdf.addImage(imgData, 'PNG', 0, marginTop, pdfWidth, totalImgHeight);
                
                // MASKING BAWAH HALAMAN 1 (Wajib!)
                pdf.setFillColor(255, 255, 255); 
                pdf.rect(0, pdfHeight - marginBottom, pdfWidth, marginBottom, 'F'); 

                heightLeft -= contentHeightPerPage;

                // LOOP PAGES
                while (heightLeft > 5) { 
                    position -= contentHeightPerPage; 
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, marginTop + position, pdfWidth, totalImgHeight);
                    
                    // MASKING ATAS (Tutup header sisa)
                    pdf.setFillColor(255, 255, 255);
                    pdf.rect(0, 0, pdfWidth, marginTop, 'F');

                    // MASKING BAWAH (Tutup footer sisa)
                    pdf.setFillColor(255, 255, 255);
                    pdf.rect(0, pdfHeight - marginBottom, pdfWidth, marginBottom, 'F');
                    
                    heightLeft -= contentHeightPerPage;
                }
                
                pdf.save(`Contribution_Margin_${new Date().toISOString().slice(0,10)}.pdf`);
            }, 1000); 
        });
    }

// ===== KONSULTAN FINANSIAL AI =====
const consultantForm = document.getElementById('konsultan-form');
const consultantChatBox = document.getElementById('konsultan-chat-box');
const consultantInput = document.getElementById('konsultan-input');

if (consultantForm) {
    consultantForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const userQuestion = consultantInput.value.trim();
        if (!userQuestion) return;

        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user-message';
        userMessageDiv.innerHTML = `<p>${userQuestion}</p>`;
        consultantChatBox.appendChild(userMessageDiv);
        consultantChatBox.scrollTop = consultantChatBox.scrollHeight;
        consultantInput.value = '';

        const loadingMessageDiv = document.createElement('div');
        loadingMessageDiv.className = 'message ai-message';
        loadingMessageDiv.innerHTML = '<p>AI sedang menganalisis...</p>';
        consultantChatBox.appendChild(loadingMessageDiv);
        consultantChatBox.scrollTop = consultantChatBox.scrollHeight;

        const prompt = `
            Anda adalah seorang Konsultan Finansial  yang memiliki pengetahuan luas di berbagai bidang, termasuk ekonomi, hukum, dan teknologi. Tangani setiap pertanyaan yang diajukan dengan serius dan berikan analisis serta solusi yang komprehensif, terstruktur, dan mudah dipahami. Jawaban harus relevan untuk individu, perusahaan, atau bahkan ekonomi global.

            Tugas: Jawab pertanyaan berikut dengan bahasa profesional, bijak, dan berbasis data. Gunakan format Markdown untuk struktur yang rapi (misal: headings, poin-poin, tabel): "${userQuestion}"
        `;

        const requestData = {
            contents: [{ parts: [{ text: prompt }] }]
        };

       fetch("/api/gemini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt })
})
        .then(res => res.json())
        .then(data => {
            loadingMessageDiv.remove();
            if (data.candidates && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                const formattedResponse = marked.parse(aiResponse);
                
                const aiMessageDiv = document.createElement('div');
                aiMessageDiv.className = 'message ai-message';
                const resultDiv = document.createElement('div');
                aiMessageDiv.appendChild(resultDiv);
                consultantChatBox.appendChild(aiMessageDiv);

                typeWriterEffect(resultDiv, formattedResponse);

                consultantChatBox.scrollTop = consultantChatBox.scrollHeight;
            } else {
                const aiMessageDiv = document.createElement('div');
                aiMessageDiv.className = 'message ai-message';
                aiMessageDiv.innerHTML = '<p style="color: red;">Maaf, AI tidak dapat memberikan respons.</p>';
                consultantChatBox.appendChild(aiMessageDiv);
            }
        })
        .catch(err => {
            console.error(err);
            loadingMessageDiv.innerHTML = '<p style="color: red;">Terjadi kesalahan koneksi ke AI.</p>';
        });
    });
}

});
