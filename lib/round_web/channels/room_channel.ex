defmodule RoundWeb.RoomChannel do
  use RoundWeb, :channel
  alias RoundWeb.Presence

  def join("room:" <> room_id, _payload, socket) do
    case length(String.split(room_id, "-")) do
      3 ->
        send(self(), :after_join)
        {:ok, %{room: room_id}, socket}

      _ ->
        {:error, %{reason: "invalid room name"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (room:lobby).
  def handle_in("shout", payload, socket) do
    broadcast(socket, "shout", payload)
    {:noreply, socket}
  end

  def handle_in("estimate", payload, socket) do
    broadcast(socket, "estimate", payload)
    {:noreply, socket}
  end

  def handle_in("show", _payload, socket) do
    broadcast(socket, "show", %{show: true})
    {:noreply, socket}
  end

  def handle_in("reset", _payload, socket) do
    broadcast(socket, "reset", %{reset: true})
    {:noreply, socket}
  end

  # def handle_in("become_leader", _payload, socket) do
  #   push
  #   {:noreply, socket}
  # end

  def handle_info(:after_join, socket) do
    push(socket, "presence_state", Presence.list(socket))

    {:ok, _} =
      Presence.track(socket, socket.assigns.user_id, %{
        online_at: inspect(System.system_time(:second))
      })

    people = length(Map.to_list(Presence.list(socket)))
    IO.puts(:stdio, people)

    with is_leader <- length(Map.to_list(Presence.list(socket))) == 1 do
      push(socket, "become_leader", %{leader: is_leader})
    end

    {:noreply, socket}
  end
end
