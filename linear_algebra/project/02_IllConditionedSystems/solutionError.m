function error = solutionError(A)
  n = length(A);
  x = ones(n, 1);
  b = A*x;
  xhat = A\b;
  diff = xhat - x;
  error = norm(diff, inf);  
end
