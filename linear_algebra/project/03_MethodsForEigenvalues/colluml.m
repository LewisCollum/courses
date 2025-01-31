% MA339 Project: Ill-Conditioned Systems
% Lewis Collum

% I did this using Octave instead of Matlab.
% Matlab was not installing properly on my OS (Arch Linux).
% It should still run fine, but if it doesn't that's the reason why.

fprintf("Step 1:\n");
A = [6 -2 0; -2 9 0; 1 4 3];
[V, D] = eig(A)

B = zeros(7);
B(1:6, 2:7) = eye(6);
B(7, :) = [0 -6 -2 -1 -5 -3 -9];
D = eig(B)


fprintf("Step 2:\n");
for n = 1:100
  [Q, R] = qr(A);
  A = R*Q;
end

round(A*10^4)./10^4


fprintf("Step 3:\n");
C = B'*B;
x = ones(7,1);

j = 2
for i = 1:500
  y = C*x;
  eigenvalue = y(j)/x(j);
  x = y/norm(y);
end

eigenvalue
x = round(x*10^4)./10^4
