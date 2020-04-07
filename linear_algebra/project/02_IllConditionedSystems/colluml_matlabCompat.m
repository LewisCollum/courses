% MA339 Project: Ill-Conditioned Systems
% Lewis Collum

%% Step 1
N1 = 1:15;
errorsH = ones(length(N1), 1);
conditionsH = ones(length(N1), 1);

for n = N1
  H = hilb(n);
  errorsH(n) = solutionError(H);
  conditionsH(n) = cond(H, inf);
end

fprintf("Table 1:\n");
quickTable(5:5:15, errorsH, conditionsH);
quickPlot(N1, errorsH, 'Step 1: Hilbert Errors');
quickPlot(N1, conditionsH, 'Step 1: Hilbert Condition Numbers');


%% Step 2
N2 = 10.^(1:3);

studentId = 0621539;
rand('seed', studentId);
errorsA = zeros(3, 1);
errorsB = zeros(3, 1);
conditionsA = zeros(3, 1);
conditionsB = zeros(3, 1);

for n = N2
  A = rand(n);
  errorsA(n) = solutionError(A);
  conditionsA(n) = cond(A, inf);

  B = A + diag(sum(A,2) - diag(A));
  errorsB(n) = solutionError(B);
  conditionsB(n) = cond(B, inf);
end

fprintf("Table 2-A:\n");
quickTable(N2, errorsA, conditionsA);
fprintf("\nTable 2-B:\n");
quickTable(N2, errorsB, conditionsB);


%% Step 3
fprintf("\nStep 3:\n");
C = [9 6 3;
     8 5 2;
     7 4 1.01]

errorC = solutionError(C);
conditionC = cond(C, inf);

fprintf("Error: %.2E\nCondition Number: %.2E\n", errorC, conditionC);


%% Helper Functions
function error = solutionError(A)
  n = length(A);
  x = ones(n, 1);
  b = A*x;
  xhat = A\b;
  diff = xhat - x;
  error = norm(diff, inf);  
end

function quickTable(i, errors, conditions)
  fprintf("    n       error       cond\n");
  for n = i
    fprintf("%5i\t| %.2E\t| %.2E\n", n, errors(n), conditions(n));
  end
end

function quickPlot(x, y, label)
  figure
  semilogy(x, y)
  xlabel('n')
  title(label)
  xlim([1 15])
  grid on
end
