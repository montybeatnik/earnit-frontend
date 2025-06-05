// styles/theme.tsx
import { StyleSheet } from 'react-native';

export const colors = {
    primary: '#3B82F6',      // Tailwind blue-500
    secondary: '#10B981',    // Tailwind green-500
    danger: '#EF4444',       // Tailwind red-500
    gray: '#6B7280',         // Tailwind gray-500
    light: '#F3F4F6',
    dark: '#111827',
    background: '#FFFFFF',
    text: '#333333',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const typography = {
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.dark,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.gray,
    },
    body: {
        fontSize: 16,
        color: colors.dark,
    },
    bodyCenter: {
        fontSize: 16,
        color: colors.text,
        textAlign: 'center',
        marginTop: 8,
    },
    small: {
        fontSize: 12,
        color: colors.gray,
    },
};

export const theme = {
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    image: {
        width: 250,
        height: 250,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: colors.gray,
        marginBottom: 30,
        textAlign: 'center',
    },
    buttonGroup: {
        width: '100%',
        gap: 12,
    },
};

export const themeStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.lg,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    imageContainer: {
        flexShrink: 0,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    image: {
        width: 220,
        height: 220,
        resizeMode: 'contain',
    },
    buttonGroup: {
        width: '100%',
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 6,
        padding: spacing.sm,
        marginVertical: spacing.sm,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Android
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    fullScreenContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xl,
        backgroundColor: colors.background,
    },
    imageSection: {
        alignItems: 'center',
        marginTop: spacing.md,
    },
    textSection: {
        alignItems: 'center',
        paddingHorizontal: spacing.md,
    },
    buttonSection: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: spacing.md,
    },
    card: {
        backgroundColor: colors.light,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.gray,
        padding: spacing.md,
        marginBottom: spacing.md,
        width: '100%',
    },
});

export const themedStyles = (
    fn: (theme: {
        colors: typeof colors;
        spacing: typeof spacing;
        typography: typeof typography;
        theme: typeof theme;
    }) => any
) => {
    if (typeof fn !== 'function') {
        throw new Error('Expected a function in themedStyles, but got ' + typeof fn);
    }
    return StyleSheet.create(fn({ colors, spacing, typography, theme }));
};