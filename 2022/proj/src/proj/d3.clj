(ns proj.d3
  (:require [clojure.string :as str])
  (:require [clojure.set :as set]))

(defn intersection [& a]
  (first (into [] (apply set/intersection (map set a)))))

(defn priority [char]
  (cond
    (= nil (re-matches #"[a-z]" (str char))) (- (int char) 38)
    :else (- (int char) 96)))

(defn parse [fn]
  (->> (slurp "resources/3.txt")
       (#(str/split % #"\n"))
       (fn)
       (map (partial apply intersection))
       (map priority)
       (reduce +)))

(defn split [s]
  (split-at (/ (count s) 2) s))

(comment
  "Part 1"
  (->> (parse (partial map split))))

(comment
  "Part 2"
  (->> (parse (partial partition-all 3))))