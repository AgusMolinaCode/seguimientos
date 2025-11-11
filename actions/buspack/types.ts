/**
 * Parámetros específicos de BusPack
 * La URL de BusPack requiere: Letra, Boca y Numero
 * Ejemplo: https://netsolutions.empresar-sys.com.ar:27576/apps/gspclientes/?idEmp=&Letra=r&Boca=3101&Numero=10055
 */
export interface BusPackParams {
  letra: string;  // Ej: "r"
  boca: string;   // Ej: "3101"
  numero: string; // Ej: "10055"
}
