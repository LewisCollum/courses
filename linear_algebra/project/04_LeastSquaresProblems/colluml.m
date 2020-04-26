% MA339 Project: Least-Squares Problems
% Lewis Collum

% I did this using Octave instead of Matlab.
% Matlab was not installing properly on my OS (Arch Linux).
% It should still run fine, but if it doesn't that's the reason why.

fprintf("Step 2:\n");
 
t = [0, 2, 3, 5, 7, 8, 10];
y = [0, 6, 2, 1, 5, 3, 9];

x = polyfit(t, y, 1);
beta0 = x(2)
beta1 = x(1)
fit = x(1) + x(2)*t;

figure
plot(t, y, '*b', t, fit, '-r')
legend('data','fit')
xlabel('t')
ylabel('y')
title('least-squares line for student number data')
uiwait


fprintf("\nStep 3:\n");
[time, temp] = set_temps;
%time = time(time>=2000);
%temp = temp(time>=2000);
t3 = [floor(time(1)):2100];

fprintf("Linear -------------\n");
x1 = polyfit(time, temp, 1);
beta10 = x1(2)
beta11 = x1(1)
fit1 = beta10 + beta11*t3;

fprintf("Quadratic ----------\n");
x2 = polyfit(time, temp, 2);
beta20 = x2(3)
beta21 = x2(2)
beta22 = x2(1)
fit2 = beta20 + beta21*t3 + beta22*t3.^2;

fprintf("Linear+Cycle -------\n");
A3 = [ones(size(time)) time sin(2*pi*time) cos(2*pi*time)];
x3 = A3\temp;
beta30 = x3(1)
beta31 = x3(2)
beta32 = x3(3)
beta33 = x3(4)
fit3 = beta30 + beta31*t3;

lastTime = time(length(time));
plot(time, temp, '-c',
     t3(t3 <= lastTime), fit1(t3 <= lastTime), '-r')
ylabel('temperature (F)')
xlabel('time (years)')
title('Linear Regression of Cyclical Temperature at Rocky Ford')
uiwait

format longG
fprintf("\nLinear T(2100) = %f\n", fit1(t3 == 2100))
fprintf("Quadratic T(2100) = %f\n", fit2(t3 == 2100))
fprintf("Linear+Cycle T(2100) = %f\n", fit3(t3 == 2100))
