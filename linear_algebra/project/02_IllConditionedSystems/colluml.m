% MA339 Project: Ill-Conditioned Systems
% Lewis Collum

function error = solutionError(A)
  n = length(A);
  x = ones(n, 1);
  b = A*x;
  xhat = A\b;
  diff = xhat - x;
  error = norm(diff, inf);  
end

function errorTable(i, errors, conditions)
  printf("  n     error\t\t  cond\n");
  for n = i
    printf("%3i\t| %.3E\t| %.3E\n", n, errors(n), conditions(n));
  end
end

% --- Step 1 ---
N = 1:15;
for n = N
  A = hilb(n);
  errors(n) = solutionError(A);
  conditions(n) = cond(A, inf);
end

errorTable(5:5:15, errors, conditions);

% --- Step 2 ---
rand('seed', 0621539);

for n = 5:5:15
  A = rand(n);
  errorsA(n) = solutionError(A);
  conditionsA(n) = cond(A, inf);

  B = A + diag(sum(A,2) - diag(A));
  errorsB(n) = solutionError(B);
  conditionsB(n) = cond(B, inf);
end

errorTable(5:5:15, errorsA, conditionsA);
printf("\n")
errorTable(5:5:15, errorsB, conditionsB);

% --- Step 3 ---
C = [9 6 3;
     8 5 2;
     7 4 1.01]

errorC = solutionError(C);
conditionC = cond(C, inf);

printf("Error: %.3E\nCondition Number: %.3E", errorC, conditionC);
