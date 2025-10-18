class Harcama {

    constructor(aciklama, miktar, tur){
        this.id = Date.now(); // Benzersiz ID oluşturma ( silme ve güncel LocalStorage için)
        this.aciklama = aciklama; 
        this.miktar = parseFloat(miktar); // miktarı sayıya çevirme, inputtan string gelecek
        this.tur = tur // gelir veya gider
        this.tarih = new Date();
    }
}

class UygulamaYoneticisi{
    constructor(){
        this.harcamalar = [];
    }
harcamaEkle(harcama) {
this.harcamalar.push(harcama);
}

harcamaSil(id){
this.harcamalar = this.harcamalar.filter(harcama => harcama.id !== id);
}

toplamGelirHesapla(){
return this.harcamalar.filter(harcama => harcama.tur === "gelir").reduce((toplam, harcama) => toplam + harcama.miktar, 0);
}

toplamGiderHesapla(){
return this.harcamalar.filter(harcama => harcama.tur === "gider").reduce((toplam, harcama) => toplam + harcama.miktar, 0);
}

bakiyeHesapla(){
    return this.toplamGelirHesapla() - this.toplamGiderHesapla();
}
}
const app = new UygulamaYoneticisi();

//Form Elementleri
const aciklamaInput = document.getElementById('aciklama-input'); 
const miktarInput = document.getElementById('miktar-input');     
const turSelect = document.getElementById('tur-select');         
const ekleBtn = document.getElementById('ekle-btn');             

//Özet Elementlerini Seç
const toplamGelirElement = document.getElementById('toplam-gelir');
const toplamGiderElement = document.getElementById('toplam-gider');
const bakiyeElement = document.getElementById('bakiye');

//Liste Bölümünü Seç
const harcamaListesi = document.getElementById('harcama-listesi');

ekleBtn.addEventListener('click', formuGonder);

function formuGonder(e) {
    e.preventDefault();

    const aciklama = aciklamaInput.value;
    const miktar = miktarInput.value;
    const tur = turSelect.value;

    if(!aciklama || parseFloat(miktar) <= 0 || isNaN(parseFloat(miktar))){
        alert("Lütfen geçerli bir açıklama ve pozitif miktar giriniz");
        return;
    }
    const yeniHarcama = new Harcama(aciklama, miktar, tur);

    app.harcamaEkle(yeniHarcama);

    aciklamaInput.value = '';
    miktarInput.value = '';
    turSelect.value = 'gider';

    listeGuncelle();
    ozetGuncelle();
    kaydet();
}

function listeGuncelle(){
harcamaListesi.innerHTML = '';

if (app.harcamalar.length === 0) { 
    harcamaListesi.innerHTML = '<p class="bos-mesaj">Henüz işlem bulunmuyor...</p>'; 
    return; }

app.harcamalar.forEach((harcama) =>{
    const itemDiv = document.createElement('div');

    itemDiv.classList.add('harcama-item');
    itemDiv.classList.add(harcama.tur);
    itemDiv.dataset.id = harcama.id;

    const tarihObjesi = new Date(harcama.tarih);
    const formatliTarih = tarihObjesi.toLocaleDateString('tr-TR');

    itemDiv.innerHTML = `
        <div class="harcama-bilgisi">
            <div class="harcama-aciklama">${harcama.aciklama}</div>
            <div class="harcama-tarih">${formatliTarih}</div>
        </div>
        <div class="harcama-miktar">${harcama.miktar.toFixed(2)} TL</div>

        <button class="sil-btn">❌</button>
    `;

    const silBtn = itemDiv.querySelector('.sil-btn');
    silBtn.addEventListener('click', () => {
        app.harcamaSil(harcama.id);
        listeGuncelle();
        ozetGuncelle();
        kaydet();
    });
    harcamaListesi.appendChild(itemDiv);

});
}

function ozetGuncelle(){

    const toplamGelir = app.toplamGelirHesapla();
    const toplamGider = app.toplamGiderHesapla();
    const bakiye = app.bakiyeHesapla();

    toplamGelirElement.textContent = toplamGelir.toFixed(2) + 'TL';
    toplamGiderElement.textContent = toplamGider.toFixed(2) + 'TL';
    bakiyeElement.textContent = bakiye.toFixed(2) + 'TL';

    if(bakiye < 0){
        bakiyeElement.style.color = 'red';
    }else{
        bakiyeElement.style.color = 'green';
    } 
}

function kaydet(){
    const jsonVeri = JSON.stringify(app.harcamalar);
    localStorage.setItem('harcamalar', jsonVeri);
}

function yukle(){
    const veri = localStorage.getItem('harcamalar');

    if(veri != null){
     app.harcamalar=JSON.parse(veri);
        listeGuncelle();
        ozetGuncelle();

    }
}
document.addEventListener('DOMContentLoaded', yukle);