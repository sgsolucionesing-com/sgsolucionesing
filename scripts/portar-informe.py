#!/usr/bin/env python3
"""Porta un informe tecnico al sistema Nocturne.

Reemplaza el bloque <style> del informe por la hoja informe-nocturne.css y
agrega el viewport y las fuentes Barlow. No toca el resto del documento.

Uso: portar_informe.py <informe.html> <informe-nocturne.css> <salida.html>
"""
import sys
import re

origen, hoja, destino = sys.argv[1], sys.argv[2], sys.argv[3]

with open(origen, encoding="utf-8") as f:
    html = f.read()

with open(hoja, encoding="utf-8") as f:
    css = f.read()

# Un unico bloque <style> ... </style>, el primero del documento.
patron = re.compile(r"<style>.*?</style>", re.DOTALL)
if len(patron.findall(html)) != 1:
    sys.exit("Se esperaba exactamente un bloque <style>; abortado.")

cabecera = (
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    '<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600'
    '&family=Barlow+Condensed:wght@500;600;700&display=swap" rel="stylesheet">\n'
    "<style>\n" + css + "\n</style>"
)

salida = patron.sub(lambda _: cabecera, html, count=1)

# El viewport no debe duplicarse si el original ya lo traia.
if html.count('name="viewport"') > 0:
    salida = salida.replace(
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n', "", 1
    )

with open(destino, "w", encoding="utf-8") as f:
    f.write(salida)

print(f"origen  : {len(html):>12,} bytes")
print(f"salida  : {len(salida):>12,} bytes")
print(f"escrito : {destino}")
