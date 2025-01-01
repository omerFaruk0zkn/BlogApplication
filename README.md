# BlogApp

## Proje Linki

<a href="https://blogapplication-237x.onrender.com/" target="_blank">Blog Uygulamasına Git</a>

---

## Proje Tanıtımı

**BlogApp**, modern bir blog platformudur. Kullanıcıların blog oluşturup paylaşabildiği, diğer blogları okuyabildiği ve yorum yapabildiği bir sistemdir. Proje full-stack bir mimariye sahiptir ve React, NodeJS ve MongoDB gibi teknolojiler kullanılarak geliştirilmiştir.

---

## Özellikler

### Kullanıcı Özellikleri
- **Kayıt ve Giriş:** Kullanıcılar JWT tabanlı doğrulama ile güvenli bir şekilde giriş yapabilir.
- **Blog Yönetimi:** Blog ekleme, düzenleme ve silme işlemleri yapılabilir.
- **Yorum Sistemi:** Bloglara yorum yapabilir, yorumları düzenleyebilir ve silebilir.
- **Kategori Filtreleme:** Blogları kategoriye göre listeleyebilir.
- **Profil Yönetimi:** Profil bilgilerini ve resimlerini güncelleyebilir.

### Admin Özellikleri
- **Kullanıcı Yönetimi:** Tüm kullanıcıları listeleme, düzenleme ve silme.
- **Blog Moderasyonu:** Blog içeriklerini onaylama veya reddetme.
- **Yorum Moderasyonu:** Yorum içeriklerini onaylama veya reddetme.
- **Kategori Yönetimi:** Blog kategorilerini oluşturma, düzenleme ve silme.

---

## Teknolojiler

### Frontend
- **React**: Kullanıcı arayüzü geliştirme.
- **Redux**: Global state yönetimi.
- **Tailwind CSS**: Modern CSS framework ile görsel tasarım.

### Backend
- **NodeJS**: Restful API geliştirme.
- **MongoDB**: Veritabanı yönetimi.
- **Multer**: Dosya yükleme yönetimi.

---

## Kurulum ve Kullanım

### 1. Depoyu Klonlama

```bash
git clone https://github.com/omerFaruk0zkn/BlogApplication.git
cd blogApp
```

### 2. Backend Kurulumu
- api klasörüne gidin:
  ```bash
  cd api
  ```
- Gerekli bağımlılıkları yükleyin:
  ```bash
  npm install
  ```
- .env dosyası oluşturun ve aşağıdaki bilgileri ekleyin:
  ```bash
  MONGO_URI=<MongoDB bağlantı URI>
  JWT_SECRET=<JWT için gizli anahtar>
  PORT=5000
  ```
- Sunucuyu çalıştırın:
  ```bash
  npm run dev
  ```

### 3. Frontend Kurulumu
- client klasörüne gidin:
  ```bash
  cd client
  ```
- Gerekli bağımlılıkları yükleyin:
  ```bash
  npm install
  ```
- .env dosyası oluşturun ve aşağıdaki bilgileri ekleyin:
  ```bash
  REACT_APP_SERVER_URL=http://localhost:5000
  ```
- React uygulamasını çalıştırın:
  ```bash
  npm start
  ```

---

## Kullanım Senaryoları

### 1. Kayıt ve Giriş:
- Kullanıcılar e-posta ve şifre ile kayıt olabilir ve giriş yapabilir.
- JWT ile güvenli oturum yönetimi sağlanır.

### 2. Blog İşlemleri:
- Kullanıcılar blog oluşturabilir, düzenleyebilir ve silebilir.
- Admin tarafından onaylanan bloglar herkese görünür hale gelir.

### 3. Yorum Sistemi:
- Kullanıcılar bloglara yorum yapabilir, yorumları düzenleyebilir veya silebilir.
- En popüler yorumlar otomatik olarak sıralanır.

### 4. Kategori Yönetimi:
- Bloglar kategorilere göre filtrelenebilir.
- Admin, kategorileri düzenleyebilir veya silebilir.
