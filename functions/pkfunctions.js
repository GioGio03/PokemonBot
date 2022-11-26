const randomNumber = (min, max) => {
    const t = Math.random() * (max - min) + min;
    return t.toFixed(2);
};

module.exports = {
    randomNumber(min, max) {
        randomNumber;
    },
    genIV(min, max) {
        var gen = `${randomNumber(min, max)}`;
        if (gen[1] == ".") {
            gen = gen.slice(0, 3);
        } else if (gen[2] == ".") {
            gen = gen.slice(0, 4);
        } else if (gen[3] == ".") {
            gen = gen.slice(0, 5);
        }
        return gen;
    },
    getlength(number) {
        return number.toString().length;
    },
    capitalize(arg) {
        return arg.charAt(0).toUpperCase() + arg.slice(1);
    },
};
