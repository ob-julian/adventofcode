#lang racket

(define file-contents
  ;(call-with-input-file "testData.txt"
  (call-with-input-file "input.txt"
    (lambda (input-port)
      (let loop ((lines '()))
        (let ((line (read-line input-port)))
          (if (eof-object? line)
              (reverse lines)
              (loop (cons (map string->number (string-split (regexp-replace* #px"\\s+$" line "") " ")) lines))))))))


(define (solver1 fileArray)
  (cond
    ((empty? fileArray) 0) ; Base case: empty list
    (else
     (+ (iterativeDifFinder1 (first fileArray)) (solver1 (rest fileArray))))))


(define (iterativeDifFinder1 inputList)
  (if (not (= (foldl + 0 inputList) 0))
      (+ (last inputList) (iterativeDifFinder1 (calculateDifferences inputList)))
       0))


(define (calculateDifferences lst)
  (cond
    ((empty? lst) '()) ; Base case: empty list
    ((empty? (rest lst)) '()) ; Base case: single element list
    (else
     (cons (- (second lst) (first lst))
           (calculateDifferences (rest lst))))))


(define (solver2 fileArray)
  (cond
    ((empty? fileArray) 0) ; Base case: empty list
    (else
     (+ (iterativeDifFinder2 (first fileArray)) (solver2 (rest fileArray))))))

(define (iterativeDifFinder2 inputList)
  (if (not (= (foldl + 0 inputList) 0))
      (+ (first inputList) (- (iterativeDifFinder2 (calculateDifferences inputList))))
       0))

;(define numbers '(10  13  16  21  30  45))
;(define differences (iterativeDifFinder2 numbers))
;(displayln differences)

(displayln "9th  Advent of Code")
(display "1: ")
(displayln (solver1 file-contents))
(display "2: ")
(displayln (solver2 file-contents))