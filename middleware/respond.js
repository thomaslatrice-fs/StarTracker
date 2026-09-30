module.exports = (req, res, next) => {
  req.wantsJson = () =>
    Boolean(req.is("application/json")) ||
    (req.get("Accept") || "").includes("application/json");

  res.respond = (status, { html, json, locals = {} }) => {
    res.status(status);
    if (req.wantsJson()) return res.json(json);
    return res.render(html, locals);
  };

  next();
};
