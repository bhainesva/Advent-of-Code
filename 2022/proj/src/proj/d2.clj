(ns proj.d2
  (:require [clojure.string :as str]))

(defn parse [score]
  (->> (slurp "resources/2.txt")
      (#(str/split % #"\n"))
      (map #(str/split % #" "))
      (map score)
      (reduce +))
  )

(comment
  "Part 1"
  (defn score [[them me]]
    (let [me' ({"X" "A" "Y" "B" "Z" "C"} me)]
      (+ 1 (.indexOf ["A" "B" "C"] me')
         (cond
           (= 0 (apply - (map-indexed #(mod (+ %1 (int (.charAt %2 0))) 3) [them me']))) 0
           (= them me') 3
           :else 6))))
  (parse score))

(comment
  "Part 2"
  (defn score [[them result]]
    (case result
      "X" (+ 0 (+ 1 (.indexOf ["B" "C" "A"] them)))
      "Y" (+ 3 (+ 1 (.indexOf ["A" "B" "C"] them)))
      "Z" (+ 6 (+ 1 (.indexOf ["C" "A" "B"] them)))))
  (parse score))