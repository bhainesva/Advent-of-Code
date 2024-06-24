(ns proj.d1
  (:require [clojure.string :as str])
  (:require [com.rpl.specter :as sp]))

(defn parse []
  (->> (slurp "resources/1.txt")
       (#(str/split % #"\n\n"))
       (map #(str/split % #"\n"))
       (sp/transform [sp/ALL sp/ALL] #(Integer/parseInt %))))

(comment
  "Part 1"
  (->> (parse)
       (map #(reduce + %))
       (reduce max)))

(comment
  "Part 2"
  (->> (parse)
       (map #(reduce + %))
       (sort)
       (take-last 3)
       (reduce +)))