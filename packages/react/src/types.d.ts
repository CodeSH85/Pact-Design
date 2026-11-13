declare module '@pact-design/tokens/uno' {
  export interface PactTheme {
    colors: Record<string, string>
    spacing: Record<string, string>
    width: Record<string, string>
    height: Record<string, string>
    minHeight: Record<string, string>
    borderRadius: Record<string, string>
    borderWidth: Record<string, string>
    lineWidth: Record<string, string>
    ringWidth: Record<string, string>
    boxShadow: Record<string, string>
    zIndex: Record<string, string>
    fontFamily: Record<string, string>
    fontSize: Record<string, string | [string, Record<string, string>]>
    fontWeight: Record<string, string>
    lineHeight: Record<string, string>
    letterSpacing: Record<string, string>
    duration: Record<string, string>
    easing: Record<string, string>
  }

  export const pactTheme: PactTheme
  export function pactPreset(): {
    name: string
    theme: PactTheme
  }
  export default pactPreset
}
