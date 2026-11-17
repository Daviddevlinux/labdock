import java.lang.management.ManagementFactory;
import java.lang.management.ThreadMXBean;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

public class BenchmarkNumerosPrimos {
    private record Measurement(long primes, double elapsedMs, double cpuPercent, int processors) {}

    private static boolean isPrime(int number) {
        if (number < 2) return false;
        if (number == 2) return true;
        if (number % 2 == 0) return false;
        for (int divisor = 3; divisor <= number / divisor; divisor += 2) {
            if (number % divisor == 0) return false;
        }
        return true;
    }

    private static long countPrimes(int start, int end) {
        long count = 0;
        for (int number = start; number <= end; number++) {
            if (isPrime(number)) count++;
        }
        return count;
    }

    private static long processCpuNanos(ThreadMXBean bean, boolean supported) {
        if (!supported) return -1;
        long total = 0;
        for (long id : bean.getAllThreadIds()) {
            long cpu = bean.getThreadCpuTime(id);
            if (cpu > 0) total += cpu;
        }
        return total;
    }

    private static Measurement measure(int threads, int maximum) throws Exception {
        ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();
        boolean canMeasureCpu = threadBean.isThreadCpuTimeSupported();
        if (canMeasureCpu && !threadBean.isThreadCpuTimeEnabled()) threadBean.setThreadCpuTimeEnabled(true);

        long cpuStart = processCpuNanos(threadBean, canMeasureCpu);
        long startNanos = System.nanoTime();
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        int rangeSize = maximum / threads;
        int remainder = maximum % threads;
        List<Callable<Long>> tasks = new ArrayList<>();
        int next = 1;
        for (int worker = 0; worker < threads; worker++) {
            int size = rangeSize + (worker < remainder ? 1 : 0);
            int start = next;
            int end = start + size - 1;
            tasks.add(() -> countPrimes(start, end));
            next = end + 1;
        }

        List<Future<Long>> results = executor.invokeAll(tasks);
        long primes = 0;
        for (Future<Long> result : results) primes += result.get();
        long cpuEnd = processCpuNanos(threadBean, canMeasureCpu);
        long elapsedNanos = System.nanoTime() - startNanos;
        executor.shutdown();
        executor.awaitTermination(1, TimeUnit.MINUTES);

        int processors = Runtime.getRuntime().availableProcessors();
        double utilization = cpuStart >= 0 && cpuEnd >= cpuStart
                ? 100.0 * (cpuEnd - cpuStart) / elapsedNanos / processors
                : Double.NaN;
        return new Measurement(primes, elapsedNanos / 1_000_000.0, utilization, processors);
    }

    public static void main(String[] args) throws Exception {
        if (args.length != 3) {
            System.err.println("Uso: java BenchmarkNumerosPrimos <threads> <numero_maximo> <repeticoes>");
            System.exit(2);
        }
        int threads = Integer.parseInt(args[0]);
        int maximum = Integer.parseInt(args[1]);
        int repetitions = Integer.parseInt(args[2]);
        if (threads < 1 || maximum < 2 || threads > maximum || repetitions < 1) {
            throw new IllegalArgumentException("Informe threads >= 1, numero_maximo >= threads e repeticoes >= 1.");
        }

        measure(threads, maximum);
        for (int repetition = 1; repetition <= repetitions; repetition++) {
            Measurement result = measure(threads, maximum);
            System.out.printf("%d,%d,%.3f,%.2f,%d%n", repetition, result.primes(),
                    result.elapsedMs(), result.cpuPercent(), result.processors());
        }
    }
}
