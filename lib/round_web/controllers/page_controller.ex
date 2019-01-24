defmodule RoundWeb.PageController do
  use RoundWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
