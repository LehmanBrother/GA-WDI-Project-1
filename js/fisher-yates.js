const shuffle = (array) => {
	let i = 0
 	let j = 0
	let temp = null

  for (let i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    console.log(i + "i");
    console.log(j + "j");
    console.log(temp + "temp");
    console.log(array[i] + "array[i]");
    console.log(array[j] + "array[j]");
    console.log("Operation: temp = array[i]");
    console.log(array);
    temp = array[i]
    console.log(i + "i");
    console.log(j + "j");
    console.log(temp + "temp");
    console.log(array[i] + "array[i]");
    console.log(array[j] + "array[j]");
    console.log("Operation: array[i] = array[j]");
    console.log(array);
    array[i] = array[j]
    console.log(i + "i");
    console.log(j + "j");
    console.log(temp + "temp");
    console.log(array[i] + "array[i]");
    console.log(array[j] + "array[j]");
    console.log("Operation: array[j] = temp");
    console.log(array);
    array[j] = temp
    console.log(i + "i");
    console.log(j + "j");
    console.log(temp + "temp");
    console.log(array[i] + "array[i]");
    console.log(array[j] + "array[j]");
  }
}

const testArr1 = [0,1,2,3,4,5,6,7,8,9];

shuffle(testArr1);
console.log(testArr1);