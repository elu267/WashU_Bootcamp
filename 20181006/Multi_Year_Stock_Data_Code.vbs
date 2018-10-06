'
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''          EASY PART
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'
Sub StockSummary()

Dim i As Long
Dim total As Variant
Dim rowCnt As Long
Dim j As Long
Dim ws As Worksheet

For Each ws In Worksheets
    'labeling the summary columns
    ws.Range("I1").Value = "Ticker Symbol"
    ws.Range("L1").Value = "Total Stock Volume"
    
    'Setting starting values
    i = CLng(1)
    j = CLng(1)
    
    'counting total rows for loop
    rowCnt = ws.Cells(Rows.Count, 1).End(xlUp).Row
    
    'need to add until the row value changes
    For i = 2 To rowCnt
    
        If ws.Cells(i + 1, 1).Value <> ws.Cells(i, 1).Value Then
            total = total + ws.Cells(i, 7).Value
        
            'Copy my data to the summary table
            ws.Range("I" & j + 1).Value = ws.Cells(i, 1).Value
        
            ws.Range("L" & j + 1).Value = total
        
            'Reset the total for the next ticker symbol
            total = CLng(0)
        
            'incredment j by one
             j = j + 1
    
         Else
            'when the value below is equal the value above then add the total to the total
            total = total + ws.Cells(i, 7).Value
    
    
         End If
    
    Next i
    'MsgBox ("endofeasypart")
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    '          MODERATE PART - TAKE THOSE ZEROS AND SHOVE THEM!
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

    Dim r As Variant
    Dim c As Variant
    Dim z As Long
    Dim openPrice As Double
    Dim closePrice As Double
    Dim currTic As Variant
    Dim prevTic As Variant
    Dim zeroTest As Boolean
    

    'labeling the additional summary columns
    ws.Range("J1").Value = "Yearly Change"
    ws.Range("K1").Value = "Percent Change"

    r = 2
    c = 2
    z = 2
    
    
    'setting open price to first value in column C
    openPrice = ws.Cells(c, 3).Value

            For c = 2 To rowCnt + 1
                
                
                'if the open price is zero then loop until it is not zero
                z = c
                If openPrice = 0 Then
                    prevTic = ws.Cells(z - 1, 1).Value
                    Do Until openPrice <> 0
                        currTic = ws.Cells(z, 1).Value
                        openPrice = ws.Cells(z, 3).Value
                        z = z + 1
                        zeroTest = True
                    Loop
                
                End If
                
                If Not IsEmpty(currTic) Then
                    If prevTic <> currTic Then
                        If zeroTest = True Then
                            openPrice = ws.Cells(c - 1, 3).Value
                            zeroTest = False
                        End If
                    End If
                End If
                
                If ws.Cells(c, 1).Value = ws.Cells(r, 9).Value Then
                    closePrice = ws.Cells(c, 6).Value
                Else
                    ws.Cells(r, 10).Value = closePrice - openPrice

                    'When the yearly change is positive it will be green and when it is negative it will be red
                    If ws.Cells(r, 10).Value >= 0 Then
                        ws.Cells(r, 10).Interior.ColorIndex = 10
                    Else
                        ws.Cells(r, 10).Interior.ColorIndex = 3
                    End If

                    'Calculating the percentage change for the year
                    If openPrice = 0 Then
                        ws.Cells(r, 11).Value = 0
                    Else
                        ws.Cells(r, 11).Value = ((closePrice - openPrice) / openPrice)
                    End If
                        openPrice = ws.Cells(c, 3).Value
                        r = r + 1
                        ws.Cells(r, 9).Value = ws.Cells(c, 1).Value
                    
                End If
    
            Next c

   ' MsgBox ("endofmoderatepart")
    ''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    '          HARD PART - EASIER THAN MODERATE PART
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Dim a, d, f, k As Variant
    Dim maxvalPct As Double
    Dim maxVol As Variant
    Dim minvalPct As Double
    Dim maxCell As Double
    Dim minCell As Double
    Dim volCell As Variant
    Dim ticMaxPct As String
    Dim ticMinPct As String
    Dim ticMaxVol As String

   ' labeling the additional summary columns
    ws.Range("N2").Value = "Greatest % Increase"
    ws.Range("N3").Value = "Greatest % Decrease"
    ws.Range("N4").Value = "Greatest Total Volume"
    ws.Range("O1").Value = "Ticker Symbol"
    ws.Range("P1").Value = "Value"


    lastRow = ws.Cells(Rows.Count, 9).End(xlUp).Row


    'using loop rather than built in functions
    'setting ranges to be evaluated

    a = ws.Range("i2", "L" & lastRow).Value
    f = ws.Range("i2", "l" & lastRow).Value
    k = ws.Range("i2", "L" & lastRow).Value

    maxvalPct = a(1, 3)
    minvalPct = f(1, 3)
    maxVol = k(1, 3)

    For d = 2 To lastRow - 1

        If a(d, 3) > maxvalPct Then
            maxvalPct = a(d, 3)
            maxCell = d
            ticMaxPct = a(d, 1)
        End If


        If f(d, 3) < minvalPct Then
            minvalPct = f(d, 3)
            minCell = d
            ticMinPct = a(d, 1)
        End If

        If k(d, 4) > maxVol Then
            maxVol = k(d, 4)
            volCell = d
            ticMaxVol = k(d, 1)
        End If

    Next d

    ws.Range("O2").Value = ticMaxPct
    ws.Range("P2").Value = maxvalPct
    ws.Range("O3").Value = ticMinPct
    ws.Range("P3").Value = minvalPct
    ws.Range("o4").Value = ticMaxVol
    ws.Range("P4").Value = maxVol


    'formatting of columns
    ws.Range("P2:P3").NumberFormat = "0.00%"
    ws.Range("J2", "J" & lastRow).NumberFormat = "0.000000000000000"
    ws.Range("K2", "K" & lastRow).NumberFormat = "0.00%"
    ws.Range("I:P").Columns.AutoFit
 '   ws.Range("A1").Select
'MsgBox ("endofhardpart")
Next ws
'MsgBox ("endofchallenge")

End Sub

