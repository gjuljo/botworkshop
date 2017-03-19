module.exports = [
  {
    out: "hi"
  },
  {
    in: "Please enter your name: ",
    out: "Donald Duck"
  },
  {
    in: (message, assert, callback) => {
      assert(message && message.text && message.text.startsWith('Hello Donald Duck'));
      callback();
    }
  }
];