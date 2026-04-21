try {
    require.resolve('esbuild-register');
    console.log('OK: esbuild-register is resolvable from root');
} catch {
    console.error('FAIL: esbuild-register is NOT resolvable from root');
    console.error('node -r esbuild-register would fail');
    process.exit(1);
}
