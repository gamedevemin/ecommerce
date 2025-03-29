document.addEventListener('DOMContentLoaded', () => {
    // DOM Elemanları
    const loginForm = document.getElementById('admin-login-form');
    
    // TEST MODU - Canlı sunucuda kapatılmalı
    const isTestMode = false; // Vercel deployment için false yapıyoruz
    
    // Sayfa yüklendiğinde admin giriş sayfasını kontrol et
    const isLoginPage = window.location.pathname.includes('admin') && 
                        (window.location.pathname.endsWith('index.html') || 
                         window.location.pathname.endsWith('admin/'));
    
    // Test modu aktifse veya Vercel ortamında isek
    if (isTestMode || isVercelEnvironment()) {
        // Test modu bildirimi
        const testBanner = document.createElement('div');
        testBanner.className = 'test-mode-banner';
        
        if (isVercelEnvironment()) {
            testBanner.textContent = 'VERCEL DEMO - Kullanıcı adı: admin / Şifre: admin123';
            testBanner.style.backgroundColor = '#0070f3'; // Vercel mavi
        } else {
            testBanner.textContent = 'TEST MODU - Kullanıcı adı: test / Şifre: test';
            testBanner.style.backgroundColor = '#ffcc00';
        }
        
        testBanner.style.color = '#333';
        testBanner.style.padding = '10px';
        testBanner.style.textAlign = 'center';
        testBanner.style.fontSize = '14px';
        testBanner.style.fontWeight = 'bold';
        document.body.prepend(testBanner);
        
        // Test kullanıcı bilgilerini otomatik doldur (sadece login sayfasında)
        if (isLoginPage) {
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            
            if (usernameInput && passwordInput) {
                if (isVercelEnvironment()) {
                    usernameInput.value = 'admin';
                    passwordInput.value = 'admin123';
                } else {
                    usernameInput.value = 'test';
                    passwordInput.value = 'test';
                }
            }
        }
    }
    
    // Vercel ortamında olup olmadığını kontrol et
    function isVercelEnvironment() {
        return typeof window !== 'undefined' && 
               (window.location.hostname.endsWith('vercel.app') || 
                window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1');
    }
    
    // Giriş formunu dinle
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const loginButton = loginForm.querySelector('button[type="submit"]');
            const errorMessage = document.getElementById('error-message');
            
            if (!username || !password) {
                if (errorMessage) {
                    errorMessage.textContent = 'Lütfen kullanıcı adı ve şifre girin.';
                    errorMessage.style.display = 'block';
                }
                return;
            }
            
            // Buton durumu
            if (loginButton) {
                loginButton.disabled = true;
                loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Giriş Yapılıyor...';
            }
            
            try {
                // Test modu kontrolü
                if (isTestMode && username === 'test' && password === 'test') {
                    // Test modunda doğrudan giriş yap
                    handleSuccessfulLogin({
                        user: {
                            username: 'test',
                            role: 'admin'
                        },
                        message: 'Test modunda giriş başarılı'
                    });
                } 
                // Vercel ortamı kontrolü
                else if (isVercelEnvironment() && username === 'admin' && password === 'admin123') {
                    // Vercel demo için direkt giriş yap
                    handleSuccessfulLogin({
                        user: {
                            username: 'admin',
                            role: 'admin'
                        },
                        message: 'Vercel demo ortamında giriş başarılı'
                    });
                }
                // Backend API ile giriş yap
                else if (window.backendAPI) {
                    const response = await window.backendAPI.login(username, password);
                    
                    if (response && response.token) {
                        handleSuccessfulLogin(response);
                    } else {
                        throw new Error('Giriş başarısız');
                    }
                } 
                // API yoksa, basit doğrulama
                else {
                    // Gerçek bir uygulamada, burada API çağrısı yapılırdı
                    // Örnek olarak basit bir doğrulama yapıyoruz
                    if (username === 'admin' && password === 'admin123') {
                        handleSuccessfulLogin({
                            user: {
                                username: 'admin',
                                role: 'admin'
                            },
                            message: 'Giriş başarılı'
                        });
                    } else {
                        throw new Error('Kullanıcı adı veya şifre hatalı');
                    }
                }
            } catch (error) {
                // Hata mesajı göster
                if (errorMessage) {
                    errorMessage.textContent = error.message || 'Giriş yapılırken bir hata oluştu.';
                    errorMessage.style.display = 'block';
                }
                
                // Buton durumunu sıfırla
                if (loginButton) {
                    loginButton.disabled = false;
                    loginButton.innerHTML = 'Giriş Yap';
                }
            }
        });
    }
    
    // Başarılı giriş işlemi
    function handleSuccessfulLogin(response) {
        // Oturum bilgilerini sakla
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminUsername', response.user.username);
        
        // Kullanıcı rolü varsa kaydet
        if (response.user.role) {
            sessionStorage.setItem('adminRole', response.user.role);
        }
        
        // Başarılı mesajı göster
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Giriş başarılı. Yönlendiriliyorsunuz...';
        successMessage.style.color = '#28a745';
        successMessage.style.textAlign = 'center';
        successMessage.style.padding = '10px';
        
        // Mevcut hata mesajını kaldır
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
        
        // Formu gizle ve başarı mesajını göster
        if (loginForm) {
            loginForm.style.display = 'none';
            loginForm.parentNode.appendChild(successMessage);
        }
        
        // Yönlendirme
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }
    
    // Şifremi unuttum linki
    const forgotPasswordLink = document.getElementById('forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Test modunda veya Vercel ortamında şifremi unuttum fonksiyonu devre dışı
            if (isTestMode || isVercelEnvironment()) {
                let message = 'Bu işlev test ortamında devre dışıdır.';
                
                if (isVercelEnvironment()) {
                    message += '\nVercel demo için - Kullanıcı adı: admin / Şifre: admin123';
                } else {
                    message += '\nTest modu için - Kullanıcı adı: test / Şifre: test';
                }
                
                alert(message);
                return;
            }
            
            const username = document.getElementById('username').value.trim();
            
            if (!username) {
                alert('Lütfen önce kullanıcı adınızı girin.');
                return;
            }
            
            // Gerçek bir uygulamada, burada şifre sıfırlama maili gönderme API çağrısı yapılırdı
            alert(`${username} kullanıcısı için şifre sıfırlama bağlantısı gönderildi.`);
        });
    }
}); 