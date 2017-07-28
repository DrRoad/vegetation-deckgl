x <- read.csv("green.csv", header=F)

par(mfrow=c(2, 2), oma=c(0, 0, 0, 0), omi=c(0, 0, 0, 0))

with(x, {
  z <- log(V1)

  hist(V1[V1 > 0], breaks=100000)
  hist(z, breaks=100000)
  plot(quantile(V1, probs=(seq(0, 1, 0.1))), type="l")
  plot(quantile(z, probs=(seq(0, 1, 0.1))), type="l")

  print(range(V1))
  print(quantile(V1, probs=(seq(0, 1, 0.1))))
  print(range(z[z != -Inf]))
  print(quantile(z, probs=(seq(0, 1, 0.1))))

})

