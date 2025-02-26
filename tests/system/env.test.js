test('.env | App Definition', async () => {
    expect(process.env.PORT).toBe('3000');
    expect(process.env.JWT_SECRET).toBeTruthy();
});