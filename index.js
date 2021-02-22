const { memoize } = require ("@aws-sdk/property-provider");

process.on('unhandledRejection', (error) => {
    console.log('unhandledRejection', error);
});

const provider = (init) => {
    let i = init;
    return async () => {
        i++;
        console.log("init",init,"i",i, i%2);


        if (i % 2 === 1) {
            return 42;
        }
        throw new Error("plop");
    }
}

const test = async () => {

    const providerSucceedFail = provider(0);
    const providerFailSucceed = provider(1);

    // succeed, cached
    let test1 = memoize(providerSucceedFail);
    const s1 = await test1();
    console.log("s1",s1);
    const s2 = await test1();
    console.log("s2", s2);


    // fail, cached - even if always expired
    const test2 = memoize(
        providerFailSucceed,
        () => {
            console.log("never called");
            return true;
        });

    try {
        const f1 = await test2();
    } catch (e) {
        console.log("f1", e);
    }

    try {
        // not called again
        const f2 = await test2();
    } catch (e) {
        console.log("f2", e);
    }
}

test()
