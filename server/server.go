package main

import (
  "log"
  "os"
  "io/ioutil"
  "net/http"
  "github.com/gorilla/websocket"
  "github.com/rs/cors"
  "github.com/google/uuid"
)

var useMockedAuth = false

var upgrader = websocket.Upgrader{
    ReadBufferSize: 1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool { return true },
}

func reader(conn *websocket.Conn) {
    for {
        messageType, p, err := conn.ReadMessage()
        if err != nil {
            log.Println(err)
            return
        }
        log.Println(string(p))
        if err := conn.WriteMessage(messageType, p); err != nil {
            log.Println(err)
            return
        }
    }
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
    }
    log.Println("Client Connected")
    err = ws.WriteMessage(1, []byte("Hi Client!"))
    if err != nil {
        log.Println(err)
    }
    reader(ws)
}

func verifyGoogleAuth(accessToken string) string {
    if useMockedAuth {
        return stubbedVerifyGoogleAuth(accessToken)
    }
    // Make a call to google to verify token:
    // url: https://www.googleapis.com/oauth2/v1/userinfo?access_token=
    resp, err := http.Get("https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + accessToken)
    if err != nil {
        log.Fatalln(err)
    }

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        log.Fatalln(err)
   }
   log.Println(uuid.New())
   sb := string(body)
   return sb
}

func stubbedVerifyGoogleAuth(accessToken string) string {
   return "{\"id\": \"102883106007375937888\",\"email\": \"alanmanderson@gmail.com\",\"verified_email\": true,\"name\": \"Alan Anderson\",\"given_name\": \"Alan\",\"family_name\": \"Anderson\",\"picture\": \"https://lh3.googleusercontent.com/a/ACg8ocIUoqeNFK89-OJJnRKpmswyvQkjTZYvfn14uc8OWat7H-5dDDKWog=s96-c\"}"
}

func httpHandler2(w http.ResponseWriter, r *http.Request) {
    if r.URL.Path == "/" {
        http.NotFound(w, r)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    w.Write([]byte("{\"hello\": \"world\"}"))
    return
}

func httpHandler(w http.ResponseWriter, r *http.Request) {
    log.Println(r.URL.Path)
    w.Header().Set("Access-Control-Expose-Headers", "*")
    if r.URL.Path == "/api/auth" {
        log.Println("auth")

        user := verifyGoogleAuth(r.FormValue("access_token"))
        log.Println(user)
        sessionId := uuid.NewString()
        os.OpenFile(sessionId, os.O_RDONLY|os.O_CREATE, 0666)
        w.Header().Set("Content-Type", "application/json")
        w.Header().Set("Allowed-Origins", "[http://localhost:3000]")
        w.Header().Set("Session-Id", sessionId)
        w.Write([]byte(user))
        return
    }
    log.Println("test")
    w.Header().Set("Content-Type", "application/json")
    //w.Header().Set("Allowed-Origins", "[http://localhost:3000]")
    //w.Write([]byte(user))
    w.Write([]byte("{\"hello\": \"world\"}"))

}

func main() {
    c := cors.New(cors.Options{
      AllowedOrigins: []string{"*"},
      //AllowedOrigins: []string{"http://localhost:3000"},
	})

    handler := http.HandlerFunc(httpHandler)
    wsHandler := http.HandlerFunc(wsEndpoint)
    mux := http.NewServeMux()
    log.Println("here")
    mux.Handle("/api/", c.Handler(handler))
    mux.Handle("/api/ws", wsHandler)
    log.Println("done")
    log.Fatal(http.ListenAndServe(":8080", mux))
}
