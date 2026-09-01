/*
 * LabDock — Avaliação de Desempenho de Sistemas (2026.2)
 * Lab 01 — Variabilidade e Comparação de Desempenho
 *
 * Implementação de Merge Sort em Java, usada para comparação de
 * desempenho com a versão em Python (merge_sort.py).
 *
 * Uso:
 *     java MergeSort <arquivo_entrada>
 */
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintStream;
import java.io.StreamTokenizer;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MergeSort {

    static void mergeSort(int[] arr, int esquerda, int direita) {
        if (esquerda < direita) {
            int meio = (esquerda + direita) / 2;
            mergeSort(arr, esquerda, meio);
            mergeSort(arr, meio + 1, direita);
            merge(arr, esquerda, meio, direita);
        }
    }

    static void merge(int[] arr, int esquerda, int meio, int direita) {
        int n1 = meio - esquerda + 1;
        int n2 = direita - meio;
        int[] esq = new int[n1];
        int[] dir = new int[n2];
        System.arraycopy(arr, esquerda, esq, 0, n1);
        System.arraycopy(arr, meio + 1, dir, 0, n2);

        int i = 0, j = 0, k = esquerda;
        while (i < n1 && j < n2) {
            arr[k++] = (esq[i] <= dir[j]) ? esq[i++] : dir[j++];
        }
        while (i < n1) {
            arr[k++] = esq[i++];
        }
        while (j < n2) {
            arr[k++] = dir[j++];
        }
    }

    public static void main(String[] args) throws IOException {
        System.setOut(new PrintStream(System.out, true, StandardCharsets.UTF_8));

        if (args.length != 1) {
            System.out.println("Uso: java MergeSort <arquivo_entrada>");
            System.exit(1);
        }

        List<Integer> numeros = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(args[0]))) {
            StreamTokenizer st = new StreamTokenizer(br);
            while (st.nextToken() != StreamTokenizer.TT_EOF) {
                numeros.add((int) st.nval);
            }
        }

        int[] arr = numeros.stream().mapToInt(Integer::intValue).toArray();
        int[] original = Arrays.copyOf(arr, arr.length);

        mergeSort(arr, 0, arr.length - 1);

        Arrays.sort(original);
        if (!Arrays.equals(arr, original)) {
            System.out.println("ERRO: a saída não está corretamente ordenada!");
            System.exit(1);
        }

        System.out.println("[Java] Ordenação concluída: " + arr.length + " elementos.");
    }
}
