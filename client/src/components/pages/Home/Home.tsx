import React from 'react';

function Home() {
    return (
        <div className="colum">
            <h1 style={{ 
                fontSize: 'var(--font-size-5xl)', 
                fontWeight: 700,
                marginBottom: 'var(--spacing-lg)',
                background: 'linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-primary-light) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                КОШОЧЬКИ И САБАЧЕНЬКИ
            </h1>
            <p className="text-muted" style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-xl)' }}>
                Добро пожаловать! Выберите категорию и наслаждайтесь милыми картинками
            </p>
            <img 
                src="https://avatars.mds.yandex.net/i?id=a06c24970492c41db728201ca47f76e07ecb86dd-5297754-images-thumbs&n=13"
                alt="Кошки и собаки"
                style={{ 
                    maxWidth: '600px', 
                    width: '100%',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: 'var(--shadow-xl)'
                }}
            />
        </div>
    )
}

export default Home;