exports.getUsers = (req, res) => {
  const response = [
    {
      id: 1,
      name: "Timmy",
    },
    {
      id: 2,
      name: "Olayemi",
    },
  ];

  res.status(200).json({
    status: "successful",
    data: response,
  });
};

exports.getUser = (req, res) => {
    res.send("All good")
}

exports.postUser = (req, res) => {
  console.log(req.body);
  res.status(200).send(req.body);
};
