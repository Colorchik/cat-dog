function Button({ handleClick }: any) {
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            gap: 'var(--spacing-sm)',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap'
        }}>
            <button className="button" onClick={() => handleClick('like')}>👍</button>
            <button className="button" onClick={() => handleClick('neutral')}>😐</button>
            <button className="button" onClick={() => handleClick('dislike')}>👎</button>
        </div>
    )
}

export default Button;