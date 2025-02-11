**Elevator Movement Algorithm (FIFO + LIFO)**

1. When new floor button is pressed add to queue. If queue is empty make that floor the new target.
2. Start moving towards target floor.
3. If an intermediate floor (between current and target) is added to queue on the way to target, make a stop to that floor (FIFO logic)
4. Upon arrival at target floor, make the oldest floor in queue the new target (LIFO logic).
5. Go to 2.